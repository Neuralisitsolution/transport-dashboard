import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
};

export interface ScrapedJob {
  title: string;
  link: string;
  organization: string;
  lastDate: string;
  content: string;
  source: string;
  postedDate: string;
}

async function fetchPage(url: string): Promise<string> {
  const { data } = await axios.get(url, {
    timeout: 20000,
    headers: HEADERS,
    maxRedirects: 5,
  });
  return typeof data === 'string' ? data : JSON.stringify(data);
}

/**
 * Scrape SarkariResult.com - Latest Jobs section
 */
export async function scrapeSarkariResult(): Promise<ScrapedJob[]> {
  try {
    const html = await fetchPage('https://www.sarkariresult.com/');
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Latest jobs section
    $('#post li a, .post li a, .job_listing li a').each((_, el) => {
      const title = $(el).text().trim();
      let link = $(el).attr('href') || '';
      if (title && link) {
        if (!link.startsWith('http')) link = `https://www.sarkariresult.com${link}`;
        jobs.push({ title, link, organization: '', lastDate: '', content: title, source: 'sarkariresult.com', postedDate: new Date().toISOString() });
      }
    });

    // Also try table format
    $('table.job_table tr, table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const anchor = cells.first().find('a');
        const title = anchor.text().trim() || cells.first().text().trim();
        let link = anchor.attr('href') || '';
        const lastDate = cells.last().text().trim();
        if (title && title.length > 5) {
          if (link && !link.startsWith('http')) link = `https://www.sarkariresult.com${link}`;
          jobs.push({ title, link: link || 'https://www.sarkariresult.com', organization: '', lastDate, content: title, source: 'sarkariresult.com', postedDate: new Date().toISOString() });
        }
      }
    });

    console.log(`[Scraper] SarkariResult: ${jobs.length} jobs found`);
    return jobs;
  } catch (error) {
    console.error('[Scraper] SarkariResult failed:', (error as Error).message);
    return [];
  }
}

/**
 * Scrape FreeJobAlert.com - Latest Notifications
 */
export async function scrapeFreeJobAlert(): Promise<ScrapedJob[]> {
  try {
    const html = await fetchPage('https://www.freejobalert.com/latest-notifications/');
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Table rows with job listings
    $('table tbody tr, .entry-content table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const anchor = cells.eq(0).find('a');
        const title = anchor.text().trim() || cells.eq(0).text().trim();
        const link = anchor.attr('href') || '';
        const lastDate = cells.eq(cells.length - 1).text().trim();

        if (title && title.length > 5 && link) {
          jobs.push({ title, link, organization: '', lastDate, content: title, source: 'freejobalert.com', postedDate: new Date().toISOString() });
        }
      }
    });

    // Also try post links
    if (jobs.length === 0) {
      $('article a, .entry-content a, .post a').each((_, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href') || '';
        if (title && title.length > 10 && link && link.includes('freejobalert.com') && !link.includes('#') && !title.includes('Read More')) {
          jobs.push({ title, link, organization: '', lastDate: '', content: title, source: 'freejobalert.com', postedDate: new Date().toISOString() });
        }
      });
    }

    console.log(`[Scraper] FreeJobAlert: ${jobs.length} jobs found`);
    return jobs;
  } catch (error) {
    console.error('[Scraper] FreeJobAlert failed:', (error as Error).message);
    return [];
  }
}

/**
 * Scrape SarkariExam.com
 */
export async function scrapeSarkariExam(): Promise<ScrapedJob[]> {
  try {
    const html = await fetchPage('https://www.sarkariexam.com/');
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('a').each((_, el) => {
      const title = $(el).text().trim();
      let link = $(el).attr('href') || '';
      if (title && title.length > 10 && link && (
        link.includes('/recruitment') || link.includes('/result') ||
        link.includes('/admit-card') || link.includes('/notification') ||
        title.toLowerCase().includes('recruitment') ||
        title.toLowerCase().includes('vacancy') ||
        title.toLowerCase().includes('notification') ||
        title.toLowerCase().includes('apply')
      )) {
        if (!link.startsWith('http')) link = `https://www.sarkariexam.com${link}`;
        if (!jobs.some(j => j.title === title)) {
          jobs.push({ title, link, organization: '', lastDate: '', content: title, source: 'sarkariexam.com', postedDate: new Date().toISOString() });
        }
      }
    });

    console.log(`[Scraper] SarkariExam: ${jobs.length} jobs found`);
    return jobs;
  } catch (error) {
    console.error('[Scraper] SarkariExam failed:', (error as Error).message);
    return [];
  }
}

/**
 * Scrape individual job detail page to get more info
 */
export async function scrapeJobDetail(url: string): Promise<string> {
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    // Remove scripts, styles, nav, footer
    $('script, style, nav, footer, header, .sidebar, .comment, .widget').remove();

    // Get main content
    const content = $('article, .entry-content, .post-content, .job-detail, main, #content, .content').first().text().trim();
    if (content && content.length > 100) {
      return content.substring(0, 5000);
    }

    // Fallback to body text
    return $('body').text().trim().substring(0, 5000);
  } catch (error) {
    console.error(`[Scraper] Detail page failed for ${url}:`, (error as Error).message);
    return '';
  }
}

/**
 * Scrape all sources
 */
export async function scrapeAllSources(): Promise<ScrapedJob[]> {
  console.log('[Scraper] Starting scrape of all sources...');

  const results = await Promise.allSettled([
    scrapeSarkariResult(),
    scrapeFreeJobAlert(),
    scrapeSarkariExam(),
  ]);

  const jobs: ScrapedJob[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      jobs.push(...result.value);
    }
  }

  // Deduplicate by title similarity
  const unique: ScrapedJob[] = [];
  const seen = new Set<string>();
  for (const job of jobs) {
    const key = job.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(job);
    }
  }

  console.log(`[Scraper] Total: ${jobs.length} raw, ${unique.length} unique jobs`);
  return unique;
}
