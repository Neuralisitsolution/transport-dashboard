import { connectDB } from './mongodb';
import Job from '@/models/Job';
import { fetchAllRSSFeeds } from './rss-fetcher';
import { scrapeAllSources } from './web-scraper';
import { processJobWithAI } from './ai-processor';
import slugify from 'slugify';

export async function fetchAndProcessJobs(): Promise<{
  newJobs: number;
  duplicates: number;
  errors: number;
}> {
  await connectDB();

  let newJobs = 0;
  let duplicates = 0;
  let errors = 0;

  // Fetch from RSS feeds and scrapers
  const [rssItems, scrapedItems] = await Promise.all([
    fetchAllRSSFeeds(),
    scrapeAllSources(),
  ]);

  // Combine all items
  const allItems = [
    ...rssItems.map((item) => ({
      title: item.title,
      content: item.content,
      link: item.link,
    })),
    ...scrapedItems.map((item) => ({
      title: item.title,
      content: item.content,
      link: item.link,
    })),
  ];

  for (const item of allItems) {
    try {
      // Check for duplicates
      const slug = slugify(item.title, { lower: true, strict: true });
      const existing = await Job.findOne({
        $or: [{ slug }, { title: item.title }],
      });

      if (existing) {
        duplicates++;
        continue;
      }

      // Process with AI
      const processed = await processJobWithAI(item.title, item.content, item.link);
      if (!processed) {
        errors++;
        continue;
      }

      // Save to database
      await Job.create({
        ...processed,
        slug,
        applyOnlineLink: processed.applyOnlineLink || item.link,
        isActive: true,
        isFeatured: (processed.totalVacancies || 0) >= 1000,
        views: 0,
      });

      newJobs++;
    } catch (error) {
      console.error(`Failed to process job: ${item.title}`, error);
      errors++;
    }
  }

  // Archive expired jobs
  const now = new Date().toISOString().split('T')[0];
  await Job.updateMany(
    {
      'importantDates.applicationEnd': { $lt: now, $ne: '' },
      isActive: true,
    },
    { isActive: false }
  );

  return { newJobs, duplicates, errors };
}
