import { connectDB } from './mongodb';
import Job from '@/models/Job';
import { fetchAllRSSFeeds } from './rss-fetcher';
import { scrapeAllSources, scrapeJobDetail } from './web-scraper';
import { processJobWithAI } from './ai-processor';
import slugify from 'slugify';

export interface FetchResult {
  newJobs: number;
  duplicates: number;
  errors: number;
  total: number;
  details: string[];
}

export async function fetchAndProcessJobs(): Promise<FetchResult> {
  await connectDB();

  const result: FetchResult = { newJobs: 0, duplicates: 0, errors: 0, total: 0, details: [] };

  // Fetch from all sources in parallel
  console.log('[Fetcher] Starting job fetch from all sources...');

  let rssItems: { title: string; content: string; link: string }[] = [];
  let scrapedItems: { title: string; content: string; link: string }[] = [];

  try {
    const [rssRaw, scraped] = await Promise.allSettled([
      fetchAllRSSFeeds(),
      scrapeAllSources(),
    ]);

    if (rssRaw.status === 'fulfilled') {
      rssItems = rssRaw.value.map((item) => ({
        title: item.title,
        content: item.content,
        link: item.link,
      }));
      result.details.push(`RSS: ${rssItems.length} items fetched`);
    } else {
      result.details.push(`RSS: Failed - ${rssRaw.reason}`);
    }

    if (scraped.status === 'fulfilled') {
      scrapedItems = scraped.value.map((item) => ({
        title: item.title,
        content: item.content || item.title,
        link: item.link,
      }));
      result.details.push(`Scraper: ${scrapedItems.length} items fetched`);
    } else {
      result.details.push(`Scraper: Failed - ${scraped.reason}`);
    }
  } catch (err) {
    result.details.push(`Fetch error: ${(err as Error).message}`);
  }

  // Combine all items
  const allItems = [...rssItems, ...scrapedItems];
  result.total = allItems.length;
  result.details.push(`Total raw items: ${allItems.length}`);

  if (allItems.length === 0) {
    result.details.push('No items fetched from any source');
    return result;
  }

  // Process each item
  for (const item of allItems) {
    try {
      if (!item.title || item.title.length < 5) continue;

      // Generate slug
      const slug = slugify(item.title, { lower: true, strict: true, trim: true }).substring(0, 100);
      if (!slug) continue;

      // Check for duplicates by slug or similar title
      const existing = await Job.findOne({
        $or: [
          { slug },
          { title: { $regex: `^${escapeRegex(item.title.substring(0, 40))}`, $options: 'i' } },
        ],
      });

      if (existing) {
        result.duplicates++;
        continue;
      }

      // Try to get more detail from the job page
      let detailContent = item.content;
      if (item.link && item.link.startsWith('http')) {
        try {
          const pageContent = await scrapeJobDetail(item.link);
          if (pageContent && pageContent.length > detailContent.length) {
            detailContent = pageContent;
          }
        } catch {
          // Use original content
        }
      }

      // Process with AI (or basic extraction)
      const processed = await processJobWithAI(item.title, detailContent, item.link);
      if (!processed) {
        result.errors++;
        continue;
      }

      // Ensure the apply link is the REAL source link
      if (!processed.applyOnlineLink || processed.applyOnlineLink === '') {
        processed.applyOnlineLink = item.link;
      }
      if (!processed.officialNotificationLink || processed.officialNotificationLink === '') {
        processed.officialNotificationLink = item.link;
      }

      // Save to database
      await Job.create({
        ...processed,
        slug,
        isActive: true,
        isFeatured: (processed.totalVacancies || 0) >= 1000,
        views: 0,
      });

      result.newJobs++;
      result.details.push(`+ Added: ${processed.title}`);

      // Rate limit: small delay between AI calls
      await new Promise((r) => setTimeout(r, 500));

    } catch (error) {
      const msg = (error as Error).message;
      if (msg.includes('duplicate key') || msg.includes('E11000')) {
        result.duplicates++;
      } else {
        result.errors++;
        result.details.push(`Error processing "${item.title.substring(0, 50)}": ${msg}`);
      }
    }
  }

  // Archive expired jobs
  const now = new Date().toISOString().split('T')[0];
  const archived = await Job.updateMany(
    {
      'importantDates.applicationEnd': { $lt: now, $ne: '' },
      isActive: true,
    },
    { isActive: false }
  );
  if (archived.modifiedCount > 0) {
    result.details.push(`Archived ${archived.modifiedCount} expired jobs`);
  }

  console.log(`[Fetcher] Done: ${result.newJobs} new, ${result.duplicates} dupes, ${result.errors} errors`);
  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
