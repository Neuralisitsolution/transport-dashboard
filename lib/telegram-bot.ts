import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface JobAlertData {
  title: string;
  organization: string;
  vacancies: number;
  lastDate: string;
  salary: string;
  slug: string;
}

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<boolean> {
  try {
    await axios.post(`${API_BASE}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    });
    return true;
  } catch (error) {
    console.error('Telegram send failed:', error);
    return false;
  }
}

export async function sendJobAlertTelegram(
  chatId: string,
  job: JobAlertData
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naukrialert.ai';

  const message = `
<b>New Government Job Alert!</b>

<b>${job.title}</b>
Organization: ${job.organization}
Vacancies: ${job.vacancies}
Salary: ${job.salary}
Last Date: ${job.lastDate}

<a href="${siteUrl}/jobs/${job.slug}">View Details & Apply</a>

@NaukriAlertAI`;

  return sendTelegramMessage(chatId, message);
}

export async function broadcastJobAlert(
  chatIds: string[],
  job: JobAlertData
): Promise<number> {
  let sent = 0;
  for (const chatId of chatIds) {
    const success = await sendJobAlertTelegram(chatId, job);
    if (success) sent++;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return sent;
}

export async function setWebhook(url: string): Promise<boolean> {
  try {
    await axios.post(`${API_BASE}/setWebhook`, { url });
    return true;
  } catch (error) {
    console.error('Webhook setup failed:', error);
    return false;
  }
}
