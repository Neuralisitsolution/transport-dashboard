import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface JobEmailData {
  title: string;
  organization: string;
  vacancies: number;
  lastDate: string;
  slug: string;
}

export async function sendJobAlert(
  to: string,
  jobs: JobEmailData[]
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naukrialert.ai';

  const jobListHtml = jobs
    .map(
      (job) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #eee;">
        <a href="${siteUrl}/jobs/${job.slug}" style="color:#EA580C;font-weight:bold;text-decoration:none;">${job.title}</a>
        <br><span style="color:#666;font-size:13px;">${job.organization}</span>
      </td>
      <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">
        <span style="background:#E0F2FE;color:#0369A1;padding:2px 8px;border-radius:12px;font-size:12px;">${job.vacancies} Posts</span>
      </td>
      <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;color:#DC2626;font-size:13px;">
        ${job.lastDate}
      </td>
    </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#EA580C,#1D4ED8);padding:24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:24px;">NaukriAlert AI</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Your Daily Government Job Digest</p>
    </div>
    <div style="padding:24px;">
      <h2 style="color:#1e293b;font-size:18px;">${jobs.length} New Job${jobs.length > 1 ? 's' : ''} Matching Your Profile</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:10px;text-align:left;font-size:13px;color:#64748b;">Position</th>
            <th style="padding:10px;text-align:center;font-size:13px;color:#64748b;">Vacancies</th>
            <th style="padding:10px;text-align:center;font-size:13px;color:#64748b;">Last Date</th>
          </tr>
        </thead>
        <tbody>${jobListHtml}</tbody>
      </table>
      <div style="text-align:center;margin-top:24px;">
        <a href="${siteUrl}/jobs" style="background:#EA580C;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View All Jobs</a>
      </div>
    </div>
    <div style="background:#f1f5f9;padding:16px;text-align:center;font-size:12px;color:#64748b;">
      <p>You are receiving this because you subscribed to NaukriAlert AI job alerts.</p>
      <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(to)}" style="color:#EA580C;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"NaukriAlert AI" <${process.env.SMTP_USER}>`,
      to,
      subject: `${jobs.length} New Govt Jobs - NaukriAlert Daily Digest`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export async function sendDeadlineReminder(
  to: string,
  job: JobEmailData
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naukrialert.ai';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#DC2626;padding:24px;text-align:center;">
      <h1 style="color:white;margin:0;">Deadline Reminder!</h1>
    </div>
    <div style="padding:24px;text-align:center;">
      <h2 style="color:#1e293b;">${job.title}</h2>
      <p style="color:#666;">${job.organization} | ${job.vacancies} Vacancies</p>
      <p style="color:#DC2626;font-size:20px;font-weight:bold;">Last Date: ${job.lastDate}</p>
      <a href="${siteUrl}/jobs/${job.slug}" style="background:#EA580C;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px;">Apply Now</a>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"NaukriAlert AI" <${process.env.SMTP_USER}>`,
      to,
      subject: `URGENT: ${job.title} - Application Deadline Approaching!`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Reminder email failed:', error);
    return false;
  }
}
