import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import NewsletterSignup from '@/components/NewsletterSignup';
import TelegramJoin from '@/components/TelegramJoin';
import { formatIndianNumber, MAJOR_EXAMS, INDIAN_STATES, getStateSlug } from '@/lib/constants';

const CATEGORY_STATS = [
  { name: 'Central Govt', slug: 'central-govt', count: 245, icon: '🏛️', color: 'from-blue-500 to-blue-700', description: 'SSC, UPSC, Railway, India Post' },
  { name: 'Banking', slug: 'banking', count: 89, icon: '🏦', color: 'from-green-500 to-green-700', description: 'IBPS, SBI, RBI, Insurance' },
  { name: 'State Govt', slug: 'state-govt', count: 1247, icon: '🏢', color: 'from-purple-500 to-purple-700', description: 'All 28 State PSCs' },
  { name: 'Defence', slug: 'defence', count: 34, icon: '🛡️', color: 'from-red-500 to-red-700', description: 'Army, Navy, Air Force, Para' },
  { name: 'Teaching', slug: 'teaching', count: 156, icon: '📚', color: 'from-yellow-500 to-yellow-700', description: 'KVS, NVS, CTET, TET' },
];

const FEATURED_JOBS = [
  { title: 'SSC CGL 2025', org: 'Staff Selection Commission', vacancies: 17727, lastDate: '2025-07-15', slug: 'ssc-cgl-2025', category: 'Central Govt' },
  { title: 'IBPS PO 2025', org: 'IBPS', vacancies: 4455, lastDate: '2025-08-01', slug: 'ibps-po-2025', category: 'Banking' },
  { title: 'RRB NTPC 2025', org: 'Railway Recruitment Board', vacancies: 35281, lastDate: '2025-06-30', slug: 'rrb-ntpc-2025', category: 'Central Govt' },
  { title: 'UPSC CSE 2025', org: 'Union Public Service Commission', vacancies: 1056, lastDate: '2025-06-20', slug: 'upsc-cse-2025', category: 'Central Govt' },
  { title: 'Indian Army Agniveer', org: 'Indian Army', vacancies: 46000, lastDate: '2025-07-10', slug: 'indian-army-agniveer-2025', category: 'Defence' },
  { title: 'KVS Teacher 2025', org: 'Kendriya Vidyalaya', vacancies: 13404, lastDate: '2025-08-15', slug: 'kvs-teacher-2025', category: 'Teaching' },
];

const TICKER_ITEMS = [
  'SSC CGL 2025: 17,727 vacancies - Apply before 15 July',
  'IBPS PO 2025 Notification Out - 4,455 Posts',
  'RRB NTPC 2025: 35,281 vacancies - Application Started',
  'Indian Army Agniveer Rally 2025 - 46,000 Posts',
  'UPSC Civil Services 2025 - Last Date 20 June',
  'SBI Clerk 2025 - 13,735 Vacancies',
];

export default function HomePage() {
  return (
    <>
      {/* Breaking News Ticker */}
      <div className="overflow-hidden bg-red-600 py-2 text-white">
        <div className="flex whitespace-nowrap">
          <div className="ticker-scroll flex gap-8">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Updated every 2 hours - AI Powered
          </div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            India&apos;s #1 Government
            <br />
            <span className="text-yellow-300">Job Alert Platform</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            AI-powered alerts for SSC, UPSC, Railway, Banking, Defence, State PSC and all government jobs.
            Never miss a sarkari naukri opportunity.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">1,771+</span> Active Jobs
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">50K+</span> Subscribers
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">28</span> States Covered
            </div>
          </div>
        </div>
      </section>

      {/* Today's Stats */}
      <section className="-mt-8 relative z-10 mx-auto max-w-7xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Today&apos;s Job Count by Category</h2>
            <span className="badge-green">Updated 2 hours ago</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_STATS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group rounded-xl bg-gradient-to-br p-5 text-white transition hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`rounded-xl bg-gradient-to-br ${cat.color} p-5 text-white transition group-hover:scale-105 group-hover:shadow-lg`}>
                  <div className="text-3xl">{cat.icon}</div>
                  <h3 className="mt-2 font-bold">{cat.name}</h3>
                  <p className="text-xs text-white/80">{cat.description}</p>
                  <p className="mt-2 text-2xl font-extrabold">{formatIndianNumber(cat.count)}</p>
                  <p className="text-xs text-white/70">Active Jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">Featured Jobs</h2>
            <p className="mt-1 text-gray-600">High vacancy positions with upcoming deadlines</p>
          </div>
          <Link href="/jobs" className="btn-outline hidden sm:inline-flex">
            View All Jobs
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_JOBS.map((job) => (
            <Link
              key={job.slug}
              href={`/jobs/${job.slug}`}
              className="card group"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">
                  {job.org.charAt(0)}
                </div>
                <span className="badge-orange">{job.category}</span>
              </div>
              <h3 className="mt-3 font-bold text-gray-900 group-hover:text-primary-600">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.org}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="badge-green font-bold">{formatIndianNumber(job.vacancies)} Posts</span>
                <span className="text-xs text-red-600 font-semibold">
                  Last Date: {new Date(job.lastDate).toLocaleDateString('en-IN')}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/jobs" className="btn-outline">View All Jobs</Link>
        </div>
      </section>

      {/* Quick Eligibility Widget */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="section-title">Find Jobs You&apos;re Eligible For</h2>
              <p className="mt-2 text-gray-600">
                Create a free profile and our AI will match you with government jobs
                based on your age, education, and preferences.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Get matched with jobs based on your qualifications',
                  'Receive instant email & Telegram alerts',
                  'Track application deadlines',
                  'Age eligibility auto-calculated',
                  'Category-wise fee details',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <svg className="h-5 w-5 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/profile" className="btn-primary mt-6 inline-flex">
                Create Free Profile
              </Link>
            </div>
            <div>
              <NewsletterSignup />
              <div className="mt-6">
                <TelegramJoin />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Exams */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title">Popular Government Exams</h2>
        <p className="mt-1 text-gray-600">Complete information, syllabus, and updates</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {MAJOR_EXAMS.slice(0, 16).map((exam) => (
            <Link
              key={exam.slug}
              href={`/exam/${exam.slug}`}
              className="flex items-center gap-3 rounded-lg border bg-white p-4 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700">
                {exam.name.split(' ')[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{exam.name}</p>
                <p className="text-xs text-gray-500">{exam.org}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* State Wise Jobs */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">State Wise Government Jobs</h2>
          <p className="mt-1 text-gray-600">Find government jobs in your state</p>
          <div className="mt-8 grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {INDIAN_STATES.filter((s) => s !== 'All India').slice(0, 30).map((state) => (
              <Link
                key={state}
                href={`/state/${getStateSlug(state)}`}
                className="rounded-lg border bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition hover:border-primary-300 hover:text-primary-600 hover:shadow-sm"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title">Free Tools for Job Aspirants</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/tools/salary-calculator', title: 'Salary Calculator', desc: 'Calculate your in-hand salary for any pay level under 7th CPC', icon: '💰' },
            { href: '/tools/age-calculator', title: 'Age Calculator', desc: 'Check your exact age on exam date with category-wise relaxation', icon: '📅' },
            { href: '/calendar', title: 'Exam Calendar', desc: 'Never miss an exam date. View all upcoming govt exam schedules', icon: '🗓️' },
            { href: '/preparation', title: 'Study Material', desc: 'Free syllabus, previous papers, and preparation resources', icon: '📖' },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href} className="card group text-center">
              <div className="text-4xl">{tool.icon}</div>
              <h3 className="mt-3 font-bold text-gray-900 group-hover:text-primary-600">{tool.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="section-title text-center">About NaukriAlert AI</h2>
          <div className="mt-6 space-y-4 text-gray-600">
            <p>
              NaukriAlert AI is India&apos;s most comprehensive AI-powered government job alert platform.
              We cover all categories of sarkari naukri including Central Government jobs (SSC, UPSC, Railway),
              Banking jobs (IBPS, SBI, RBI), State Government jobs (all 28 state PSCs), Defence jobs
              (Army, Navy, Air Force), and Teaching jobs (KVS, NVS, CTET).
            </p>
            <p>
              Our AI engine processes job notifications from official sources every 2 hours, ensuring you
              never miss an opportunity. We provide complete details including eligibility, salary, age limit,
              application fee, exam pattern, and direct apply links for every government job in India.
            </p>
            <p>
              Whether you&apos;re looking for sarkari naukri 2025, government jobs for graduates, bank jobs for
              freshers, or defence recruitment, NaukriAlert AI has you covered with real-time alerts via
              email and Telegram.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
