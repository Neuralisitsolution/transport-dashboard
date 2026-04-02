import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import EmailSubscriber from '@/models/EmailSubscriber';
import TelegramSubscriber from '@/models/TelegramSubscriber';
import { sendJobAlert } from '@/lib/email-sender';
import { broadcastJobAlert } from '@/lib/telegram-bot';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newJobs = await Job.find({
      isActive: true,
      createdAt: { $gte: oneDayAgo },
    }).lean();

    if (newJobs.length === 0) {
      return NextResponse.json({ message: 'No new jobs to alert', emailsSent: 0, telegramSent: 0 });
    }

    // Send email alerts
    const subscribers = await EmailSubscriber.find({ isActive: true }).lean();
    let emailsSent = 0;

    for (const sub of subscribers) {
      const matchingJobs = newJobs.filter((job) => {
        if (sub.categories.length > 0 && !sub.categories.includes(job.category)) return false;
        if (sub.states.length > 0 && !job.statesAccepted.some((s: string) => sub.states.includes(s) || s === 'All India')) return false;
        return true;
      });

      if (matchingJobs.length > 0) {
        const success = await sendJobAlert(
          sub.email,
          matchingJobs.map((j) => ({
            title: j.title,
            organization: j.organization,
            vacancies: j.totalVacancies,
            lastDate: j.importantDates.applicationEnd,
            slug: j.slug,
          }))
        );
        if (success) emailsSent++;
      }
    }

    // Send Telegram alerts
    const telegramSubs = await TelegramSubscriber.find({ isActive: true }).lean();
    let telegramSent = 0;

    for (const job of newJobs.slice(0, 10)) {
      const chatIds = telegramSubs
        .filter((sub) => {
          if (sub.categories.length > 0 && !sub.categories.includes(job.category)) return false;
          return true;
        })
        .map((sub) => sub.chatId);

      if (chatIds.length > 0) {
        const sent = await broadcastJobAlert(chatIds, {
          title: job.title,
          organization: job.organization,
          vacancies: job.totalVacancies,
          lastDate: job.importantDates.applicationEnd,
          salary: job.salary.inHandEstimate > 0 ? `₹${job.salary.inHandEstimate}/mo` : 'As per rules',
          slug: job.slug,
        });
        telegramSent += sent;
      }
    }

    return NextResponse.json({
      message: 'Alerts sent successfully',
      newJobsCount: newJobs.length,
      emailsSent,
      telegramSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron send-alerts error:', error);
    return NextResponse.json({ error: 'Alert cron failed' }, { status: 500 });
  }
}
