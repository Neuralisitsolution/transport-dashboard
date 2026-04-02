import Parser from 'rss-parser';
import { JOB_RSS_FEEDS } from './constants';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'NaukriAlert-Bot/1.0',
  },
});

export interface RawJobItem {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  source: string;
}

export async function fetchAllRSSFeeds(): Promise<RawJobItem[]> {
  const results: RawJobItem[] = [];

  const feedPromises = JOB_RSS_FEEDS.map(async (url) => {
    try {
      const feed = await parser.parseURL(url);
      return (feed.items || []).map((item) => ({
        title: item.title || '',
        link: item.link || '',
        content: item.contentSnippet || item.content || '',
        pubDate: item.pubDate || '',
        source: url,
      }));
    } catch (error) {
      console.error(`Failed to fetch RSS feed: ${url}`, error);
      return [];
    }
  });

  const feedResults = await Promise.allSettled(feedPromises);
  for (const result of feedResults) {
    if (result.status === 'fulfilled') {
      results.push(...result.value);
    }
  }

  return results;
}
