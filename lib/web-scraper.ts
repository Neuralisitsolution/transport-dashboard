import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedJob {
  title: string;
  link: string;
  organization: string;
  lastDate: string;
  content: string;
  source: string;
}

async function fetchPage(url: string): Promise<string> {
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  return data;
}

export async function scrapeSarkariResult(): Promise<ScrapedJob[]> {
  try {
    const html = await fetchPage('https://www.sarkariresult.com/');
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('#post li a').each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href') || '';
      if (title && link) {
        jobs.push({
          title,
          link: link.startsWith('http') ? link : `https://www.sarkariresult.com${link}`,
          organization: '',
          lastDate: '',
          content: title,
          source: 'sarkariresult.com',
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error('Failed to scrape SarkariResult:', error);
    return [];
  }
}

export async function scrapeFreeJobAlert(): Promise<ScrapedJob[]> {
  try {
    const html = await fetchPage('https://www.freejobalert.com/latest-notifications/');
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const titleEl = cells.eq(0).find('a');
        const title = titleEl.text().trim();
        const link = titleEl.attr('href') || '';
        const lastDate = cells.eq(1).text().trim();

        if (title && link) {
          jobs.push({
            title,
            link,
            organization: '',
            lastDate,
            content: title,
            source: 'freejobalert.com',
          });
        }
      }
    });

    return jobs;
  } catch (error) {
    console.error('Failed to scrape FreeJobAlert:', error);
    return [];
  }
}

export async function scrapeAllSources(): Promise<ScrapedJob[]> {
  const results = await Promise.allSettled([
    scrapeSarkariResult(),
    scrapeFreeJobAlert(),
  ]);

  const jobs: ScrapedJob[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      jobs.push(...result.value);
    }
  }
  return jobs;
}
