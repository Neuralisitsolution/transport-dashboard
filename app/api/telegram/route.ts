import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TelegramSubscriber from '@/models/TelegramSubscriber';
import { sendTelegramMessage } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.message) {
      return NextResponse.json({ error: 'No message' }, { status: 400 });
    }

    const chatId = body.message.chat?.id?.toString();
    const text = body.message.text || '';
    const username = body.message.from?.username || '';

    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    if (text === '/start') {
      await TelegramSubscriber.findOneAndUpdate(
        { chatId },
        { chatId, username, isActive: true, subscribedAt: new Date() },
        { upsert: true }
      );

      await sendTelegramMessage(
        chatId,
        `Welcome to <b>NaukriAlert AI</b>!\n\nYou will now receive instant government job alerts.\n\nCommands:\n/jobs - Latest jobs\n/categories - Set preferred categories\n/help - Get help`
      );
    } else if (text === '/jobs') {
      await sendTelegramMessage(
        chatId,
        `Visit our website for the latest jobs:\nhttps://naukrialert.ai/jobs\n\nOr join our category channels for filtered alerts.`
      );
    } else if (text === '/help') {
      await sendTelegramMessage(
        chatId,
        `<b>NaukriAlert AI Bot</b>\n\n/start - Subscribe to alerts\n/jobs - View latest jobs\n/categories - Set preferences\n/help - Show this message\n\nWebsite: https://naukrialert.ai`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}
