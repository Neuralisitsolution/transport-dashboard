import { NextRequest, NextResponse } from 'next/server';
import { fetchAndProcessJobs } from '@/lib/job-fetcher';

export const maxDuration = 60; // Allow up to 60s for fetching

export async function GET(request: NextRequest) {
  // Allow manual trigger from admin or cron with secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isManual = request.nextUrl.searchParams.get('manual') === 'true';

  if (cronSecret && !isManual && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting job fetch...');
    const result = await fetchAndProcessJobs();

    return NextResponse.json({
      message: 'Job fetch completed',
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] fetch-jobs error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}
