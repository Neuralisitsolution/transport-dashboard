import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'About Us',
  'Learn about NaukriAlert AI - India\'s leading AI-powered government job alert platform. Our mission, how it works, and the team behind it.',
  '/about'
);

const STATS = [
  { label: 'Active Jobs', value: '1,700+' },
  { label: 'States Covered', value: '28' },
  { label: 'Subscribers', value: '50,000+' },
  { label: 'Updates Per Day', value: '12' },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'AI Scans Official Sources',
    description:
      'Our AI engine continuously monitors official government websites, employment portals, and gazette notifications every 2 hours to detect new job postings.',
  },
  {
    step: '2',
    title: 'Data is Verified & Structured',
    description:
      'Each job notification is parsed, verified for accuracy, and structured into a consistent format with eligibility, salary, age limits, and application details.',
  },
  {
    step: '3',
    title: 'Eligibility Matching',
    description:
      'Based on your profile — age, education, category, and preferences — our system matches you with jobs you are eligible to apply for.',
  },
  {
    step: '4',
    title: 'Instant Alerts Delivered',
    description:
      'Matched jobs are sent to you instantly via email and Telegram so you never miss a deadline. You can also browse all jobs on the website.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            About NaukriAlert AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            India&apos;s most comprehensive AI-powered platform for government job alerts.
            We help millions of aspirants find the right sarkari naukri opportunities.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10 mx-auto max-w-5xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className="text-3xl font-extrabold text-primary-600">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="section-title text-center">Our Mission</h2>
        <div className="mt-6 space-y-4 text-gray-600 text-center">
          <p>
            Government job aspirants in India face a fragmented information landscape.
            Notifications are scattered across hundreds of official websites, state portals,
            and commission pages. Missing a single notification can mean losing an opportunity
            that comes once a year.
          </p>
          <p>
            NaukriAlert AI was built to solve this problem. Our mission is to
            <span className="font-semibold text-gray-900">
              {' '}ensure no eligible candidate ever misses a government job opportunity{' '}
            </span>
            due to lack of timely information. We use artificial intelligence to aggregate,
            verify, and deliver job alerts so aspirants can focus on what matters most — preparation.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="mt-2 text-center text-gray-600">
            From detection to delivery in minutes, not days.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="card flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="section-title text-center">What We Cover</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Central Government', desc: 'SSC, UPSC, Railway, India Post, DRDO, ISRO, and all central ministries.' },
            { title: 'Banking & Insurance', desc: 'IBPS, SBI, RBI, NABARD, LIC, and all public sector banks.' },
            { title: 'State Government', desc: 'All 28 State PSCs, state SSCs, and state-level recruitment boards.' },
            { title: 'Defence & Paramilitary', desc: 'Indian Army, Navy, Air Force, CRPF, BSF, CISF, NDA, and CDS.' },
            { title: 'Teaching & Education', desc: 'KVS, NVS, CTET, State TETs, and university recruitment.' },
            { title: 'Results & Admit Cards', desc: 'Exam results, admit cards, answer keys, and cut-off marks.' },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="section-title">Our Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            NaukriAlert AI is built by a passionate team of engineers, data scientists,
            and former government job aspirants who understand the challenges first-hand.
            We combine deep domain expertise with cutting-edge AI technology to deliver
            the most reliable job alert service in India.
          </p>
          <p className="mt-4 text-gray-600">
            Our content team verifies every notification against official sources, while
            our engineering team ensures alerts reach you within minutes of publication.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="section-title">Ready to Get Started?</h2>
        <p className="mt-2 text-gray-600">
          Create a free profile and start receiving personalized government job alerts today.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/profile" className="btn-primary">
            Create Free Profile
          </Link>
          <Link href="/jobs" className="btn-outline">
            Browse All Jobs
          </Link>
        </div>
      </section>
    </>
  );
}
