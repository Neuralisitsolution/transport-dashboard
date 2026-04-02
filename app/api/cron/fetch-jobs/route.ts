import { NextRequest, NextResponse } from 'next/server';
import { fetchAndProcessJobs } from '@/lib/job-fetcher';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await fetchAndProcessJobs();

    return NextResponse.json({
      message: 'Job fetch completed',
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron fetch-jobs error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
