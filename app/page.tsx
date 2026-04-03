import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import NewsletterSignup from '@/components/NewsletterSignup';
import TelegramJoin from '@/components/TelegramJoin';
import { formatIndianNumber, MAJOR_EXAMS, INDIAN_STATES, getStateSlug, getCategoryColor } from '@/lib/constants';

// Fetch real data at request time
async function getHomePageData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const [allRes, featuredRes] = await Promise.all([
      fetch(`${baseUrl}/api/jobs?limit=6&sortBy=latest`, { cache: 'no-store' }).catch(() => null),
      fetch(`${baseUrl}/api/jobs?featured=true&limit=6`, { cache: 'no-store' }).catch(() => null),
    ]);

    const allData = allRes?.ok ? await allRes.json() : { jobs: [], total: 0 };
    const featuredData = featuredRes?.ok ? await featuredRes.json() : { jobs: [], total: 0 };

    // Get category counts
    const categories = ['Central Govt', 'Banking', 'State Govt', 'Defence', 'Teaching'];
    const catCounts: Record<string, number> = {};
    for (const cat of categories) {
      try {
        const r = await fetch(`${baseUrl}/api/jobs?category=${encodeURIComponent(cat)}&limit=1`, { cache: 'no-store' });
        if (r.ok) {
          const d = await r.json();
          catCounts[cat] = d.total || 0;
        }
      } catch {
        catCounts[cat] = 0;
      }
    }

    return {
      latestJobs: allData.jobs || [],
      featuredJobs: featuredData.jobs || [],
      totalJobs: allData.total || 0,
      catCounts,
    };
  } catch {
    return { latestJobs: [], featuredJobs: [], totalJobs: 0, catCounts: {} };
  }
}

const CATEGORY_INFO = [
  { name: 'Central Govt', slug: 'central-govt', icon: '🏛️', color: 'from-blue-500 to-blue-700', description: 'SSC, UPSC, Railway, India Post' },
  { name: 'Banking', slug: 'banking', icon: '🏦', color: 'from-green-500 to-green-700', description: 'IBPS, SBI, RBI, Insurance' },
  { name: 'State Govt', slug: 'state-govt', icon: '🏢', color: 'from-purple-500 to-purple-700', description: 'All 28 State PSCs' },
  { name: 'Defence', slug: 'defence', icon: '🛡️', color: 'from-red-500 to-red-700', description: 'Army, Navy, Air Force, Para' },
  { name: 'Teaching', slug: 'teaching', icon: '📚', color: 'from-yellow-500 to-yellow-700', description: 'KVS, NVS, CTET, TET' },
];

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { latestJobs, featuredJobs, totalJobs, catCounts } = await getHomePageData();
  const jobsToShow = featuredJobs.length > 0 ? featuredJobs : latestJobs;

  return (
    <>
      {/* Breaking News Ticker */}
      {latestJobs.length > 0 && (
        <div className="overflow-hidden bg-red-600 py-2 text-white">
          <div className="flex whitespace-nowrap">
            <div className="ticker-scroll flex gap-8">
              {[...latestJobs, ...latestJobs].map((job: { title: string; totalVacancies: number; importantDates: { applicationEnd: string } }, i: number) => (
                <span key={i} className="inline-flex items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                  {job.title}{job.totalVacancies > 0 ? ` - ${formatIndianNumber(job.totalVacancies)} vacancies` : ''}
                  {job.importantDates?.applicationEnd ? ` | Last Date: ${job.importantDates.applicationEnd}` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Live Data - Updated every 2 hours - AI Powered
          </div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            India&apos;s #1 Government
            <br />
            <span className="text-yellow-300">Job Alert Platform</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            AI-powered real-time alerts for SSC, UPSC, Railway, Banking, Defence, State PSC and all government jobs.
            Never miss a sarkari naukri opportunity.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{totalJobs > 0 ? formatIndianNumber(totalJobs) : '1,000'}+</span> Active Jobs
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">28</span> States Covered
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">5</span> Categories
            </div>
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="-mt-8 relative z-10 mx-auto max-w-7xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Job Count by Category</h2>
            <span className="badge-green">Live Data</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_INFO.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className={`rounded-xl bg-gradient-to-br ${cat.color} p-5 text-white transition hover:scale-105 hover:shadow-lg`}>
                  <div className="text-3xl">{cat.icon}</div>
                  <h3 className="mt-2 font-bold">{cat.name}</h3>
                  <p className="text-xs text-white/80">{cat.description}</p>
                  <p className="mt-2 text-2xl font-extrabold">{formatIndianNumber(catCounts[cat.name] || 0)}</p>
                  <p className="text-xs text-white/70">Active Jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest/Featured Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">{featuredJobs.length > 0 ? 'Featured Jobs' : 'Latest Jobs'}</h2>
            <p className="mt-1 text-gray-600">Real-time job notifications from official sources</p>
          </div>
          <Link href="/jobs" className="btn-outline hidden sm:inline-flex">View All Jobs</Link>
        </div>

        {jobsToShow.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobsToShow.slice(0, 6).map((job: { slug: string; title: string; organization: string; category: string; totalVacancies: number; importantDates: { applicationEnd: string }; applyOnlineLink: string }) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="card group">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">
                    {job.organization?.charAt(0) || 'G'}
                  </div>
                  <span className={`badge ${getCategoryColor(job.category)}`}>{job.category}</span>
                </div>
                <h3 className="mt-3 font-bold text-gray-900 group-hover:text-primary-600 line-clamp-2">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.organization}</p>
                <div className="mt-3 flex items-center justify-between">
                  {job.totalVacancies > 0 && (
                    <span className="badge-green font-bold">{formatIndianNumber(job.totalVacancies)} Posts</span>
                  )}
                  {job.importantDates?.applicationEnd && (
                    <span className="text-xs text-red-600 font-semibold">
                      Last: {new Date(job.importantDates.applicationEnd).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500 text-lg">No jobs fetched yet.</p>
            <p className="mt-2 text-sm text-gray-400">
              Click the button below to fetch live jobs from real sources.
            </p>
            <a href="/api/cron/fetch-jobs?manual=true" target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 inline-flex">
              Fetch Live Jobs Now
            </a>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link href="/jobs" className="btn-outline">View All Jobs</Link>
        </div>
      </section>

      {/* Eligibility Section */}
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
                  'Real-time job data from official sources',
                  'Instant email & Telegram alerts for new jobs',
                  'AI-powered eligibility matching',
                  'Track application deadlines',
                  'Direct apply links to official websites',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <svg className="h-5 w-5 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/profile" className="btn-primary mt-6 inline-flex">Create Free Profile</Link>
            </div>
            <div>
              <NewsletterSignup />
              <div className="mt-6"><TelegramJoin /></div>
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
            <Link key={exam.slug} href={`/exam/${exam.slug}`} className="flex items-center gap-3 rounded-lg border bg-white p-4 transition hover:border-primary-300 hover:shadow-sm">
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

      {/* State Wise */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">State Wise Government Jobs</h2>
          <p className="mt-1 text-gray-600">Find government jobs in your state</p>
          <div className="mt-8 grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {INDIAN_STATES.filter((s) => s !== 'All India').slice(0, 30).map((state) => (
              <Link key={state} href={`/state/${getStateSlug(state)}`} className="rounded-lg border bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition hover:border-primary-300 hover:text-primary-600 hover:shadow-sm">
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title">Free Tools for Job Aspirants</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/tools/salary-calculator', title: 'Salary Calculator', desc: 'Calculate in-hand salary for any pay level under 7th CPC', icon: '💰' },
            { href: '/tools/age-calculator', title: 'Age Calculator', desc: 'Check exact age on exam date with category relaxation', icon: '📅' },
            { href: '/calendar', title: 'Exam Calendar', desc: 'Never miss an exam date. All upcoming govt exam schedules', icon: '🗓️' },
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
              We fetch real-time data from official sources including sarkariresult.com, freejobalert.com,
              and government websites. Our AI engine processes notifications every 2 hours, ensuring you
              get the latest jobs with working apply links.
            </p>
            <p>
              All job links on NaukriAlert AI point to actual official sources - when you click &quot;Apply Online&quot;,
              you go directly to the real application portal. No expired links, no fake data.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
