import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'NaukriAlert AI - Government Job Alerts India | Sarkari Naukri 2025',
  description:
    'India\'s most comprehensive AI-powered government job alert platform. Get real-time notifications for SSC, UPSC, Railway, Banking, Defence, State PSC and all sarkari naukri. Never miss a government job opportunity.',
  keywords:
    'sarkari naukri 2025, government jobs, sarkari result, SSC recruitment, bank jobs, railway jobs, defence jobs, state government jobs, UPSC, IBPS, NDA, CDS',
  openGraph: {
    title: 'NaukriAlert AI - Government Job Alerts India',
    description: 'India\'s #1 AI-powered government job alert platform. Real-time sarkari naukri alerts.',
    siteName: 'NaukriAlert AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaukriAlert AI - Government Job Alerts India',
    description: 'India\'s #1 AI-powered government job alert platform.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
