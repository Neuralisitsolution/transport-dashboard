import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo-helpers';
import {
  CENTRAL_SUBCATEGORIES,
  BANKING_SUBCATEGORIES,
  DEFENCE_SUBCATEGORIES,
  TEACHING_SUBCATEGORIES,
  STATE_COMMISSIONS,
  formatIndianNumber,
} from '@/lib/constants';

const CATEGORY_MAP: Record<
  string,
  {
    name: string;
    icon: string;
    color: string;
    gradient: string;
    description: string;
    longDescription: string;
    stats: { activeJobs: number; totalVacancies: number; avgSalary: string };
  }
> = {
  'central-govt': {
    name: 'Central Govt',
    icon: '\u{1F3DB}\uFE0F',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    description: 'SSC, UPSC, Railway, India Post and other central government jobs',
    longDescription:
      'Central Government jobs are among the most sought-after positions in India. These include Group A, B, C, and D posts under various ministries and departments of the Government of India. Major recruiting bodies include SSC (Staff Selection Commission), UPSC (Union Public Service Commission), Railway Recruitment Boards, and more.',
    stats: { activeJobs: 245, totalVacancies: 127834, avgSalary: '25,500 - 81,100' },
  },
  banking: {
    name: 'Banking',
    icon: '\u{1F3E6}',
    color: 'green',
    gradient: 'from-green-500 to-green-700',
    description: 'IBPS, SBI, RBI, Insurance and other banking sector jobs',
    longDescription:
      'Banking sector jobs offer excellent career growth and stability. IBPS conducts common recruitment for public sector banks, while SBI, RBI, and insurance companies conduct their own exams. Positions range from Clerk and PO to Specialist Officers and Grade B officers.',
    stats: { activeJobs: 89, totalVacancies: 34560, avgSalary: '29,200 - 1,42,400' },
  },
  'state-govt': {
    name: 'State Govt',
    icon: '\u{1F3E2}',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700',
    description: 'All 28 State PSCs, SSCs and government department jobs',
    longDescription:
      'State Government jobs are recruited through respective State Public Service Commissions (PSCs) and Staff Selection Commissions. Each state has its own recruitment body that conducts exams for Group A, B, C, and D posts in state departments, police, power corporations, and more.',
    stats: { activeJobs: 1247, totalVacancies: 298450, avgSalary: '18,000 - 67,700' },
  },
  defence: {
    name: 'Defence',
    icon: '\u{1F6E1}\uFE0F',
    color: 'red',
    gradient: 'from-red-500 to-red-700',
    description: 'Indian Army, Navy, Air Force, Coast Guard and paramilitary forces',
    longDescription:
      'Defence jobs in India cover the three armed forces (Army, Navy, Air Force) along with paramilitary and central armed police forces. The Agnipath scheme (Agniveer) is the latest recruitment pathway for the armed forces, while UPSC conducts CDS and NDA exams for officer-level entries.',
    stats: { activeJobs: 34, totalVacancies: 78500, avgSalary: '21,700 - 69,100' },
  },
  teaching: {
    name: 'Teaching',
    icon: '\u{1F4DA}',
    color: 'yellow',
    gradient: 'from-yellow-500 to-yellow-700',
    description: 'KVS, NVS, CTET, State TET and university teaching positions',
    longDescription:
      'Government teaching jobs include positions in Kendriya Vidyalaya Sangathan (KVS), Navodaya Vidyalaya Samiti (NVS), central and state universities, and government schools. CTET and State TET are mandatory eligibility tests for teaching positions.',
    stats: { activeJobs: 156, totalVacancies: 45200, avgSalary: '35,400 - 1,12,400' },
  },
};

const SUBCATEGORIES_MAP: Record<string, string[]> = {
  'central-govt': CENTRAL_SUBCATEGORIES,
  banking: BANKING_SUBCATEGORIES,
  'state-govt': Object.keys(STATE_COMMISSIONS).slice(0, 12),
  defence: DEFENCE_SUBCATEGORIES,
  teaching: TEACHING_SUBCATEGORIES,
};

const FEATURED_JOBS_MAP: Record<
  string,
  { title: string; org: string; vacancies: number; lastDate: string; slug: string; education: string }[]
> = {
  'central-govt': [
    { title: 'SSC CGL 2025 - Combined Graduate Level', org: 'Staff Selection Commission', vacancies: 17727, lastDate: '2025-07-15', slug: 'ssc-cgl-2025', education: 'Graduate' },
    { title: 'RRB NTPC 2025 - Non-Technical Popular Categories', org: 'Railway Recruitment Board', vacancies: 35281, lastDate: '2025-06-30', slug: 'rrb-ntpc-2025', education: '12th Pass / Graduate' },
    { title: 'UPSC Civil Services 2025 (IAS/IPS)', org: 'Union Public Service Commission', vacancies: 1056, lastDate: '2025-06-20', slug: 'upsc-cse-2025', education: 'Graduate' },
    { title: 'SSC CHSL 2025 - Combined Higher Secondary Level', org: 'Staff Selection Commission', vacancies: 6850, lastDate: '2025-08-10', slug: 'ssc-chsl-2025', education: '12th Pass' },
    { title: 'RRB Group D 2025 - Level 1 Posts', org: 'Railway Recruitment Board', vacancies: 103769, lastDate: '2025-07-25', slug: 'rrb-group-d-2025', education: '10th Pass / ITI' },
    { title: 'India Post GDS Recruitment 2025', org: 'Department of Posts', vacancies: 44228, lastDate: '2025-09-01', slug: 'india-post-gds-2025', education: '10th Pass' },
  ],
  banking: [
    { title: 'IBPS PO 2025 - Probationary Officer', org: 'IBPS', vacancies: 4455, lastDate: '2025-08-01', slug: 'ibps-po-2025', education: 'Graduate' },
    { title: 'SBI Clerk 2025 - Junior Associate', org: 'State Bank of India', vacancies: 13735, lastDate: '2025-07-20', slug: 'sbi-clerk-2025', education: 'Graduate' },
    { title: 'RBI Grade B 2025 - Officers', org: 'Reserve Bank of India', vacancies: 312, lastDate: '2025-06-15', slug: 'rbi-grade-b-2025', education: 'Graduate' },
    { title: 'IBPS Clerk 2025 - Clerical Cadre', org: 'IBPS', vacancies: 6128, lastDate: '2025-09-15', slug: 'ibps-clerk-2025', education: 'Graduate' },
    { title: 'LIC AAO 2025 - Assistant Administrative Officer', org: 'Life Insurance Corporation', vacancies: 750, lastDate: '2025-07-30', slug: 'lic-aao-2025', education: 'Graduate' },
    { title: 'SBI PO 2025 - Probationary Officer', org: 'State Bank of India', vacancies: 2000, lastDate: '2025-08-20', slug: 'sbi-po-2025', education: 'Graduate' },
  ],
  'state-govt': [
    { title: 'TSPSC Group 1 Services 2025', org: 'Telangana PSC', vacancies: 563, lastDate: '2025-07-10', slug: 'tspsc-group-1-2025', education: 'Graduate' },
    { title: 'UPPSC PCS 2025 - Combined State Services', org: 'UP PSC', vacancies: 1240, lastDate: '2025-08-05', slug: 'uppsc-pcs-2025', education: 'Graduate' },
    { title: 'Maharashtra Police Constable 2025', org: 'Maharashtra Police', vacancies: 17471, lastDate: '2025-06-25', slug: 'maha-police-2025', education: '12th Pass' },
    { title: 'RPSC RAS 2025 - Rajasthan Administrative Service', org: 'Rajasthan PSC', vacancies: 905, lastDate: '2025-07-28', slug: 'rpsc-ras-2025', education: 'Graduate' },
    { title: 'BPSC 70th Combined Exam 2025', org: 'Bihar PSC', vacancies: 1929, lastDate: '2025-08-15', slug: 'bpsc-70th-2025', education: 'Graduate' },
    { title: 'KPSC FDA/SDA 2025', org: 'Karnataka PSC', vacancies: 3702, lastDate: '2025-09-10', slug: 'kpsc-fda-sda-2025', education: 'Graduate' },
  ],
  defence: [
    { title: 'Indian Army Agniveer Rally 2025', org: 'Indian Army', vacancies: 46000, lastDate: '2025-07-10', slug: 'indian-army-agniveer-2025', education: '10th / 12th Pass' },
    { title: 'Indian Navy Agniveer SSR/MR 2025', org: 'Indian Navy', vacancies: 4600, lastDate: '2025-06-28', slug: 'navy-agniveer-2025', education: '10th / 12th Pass' },
    { title: 'NDA 2025 - National Defence Academy', org: 'UPSC', vacancies: 400, lastDate: '2025-06-15', slug: 'nda-2025', education: '12th Pass' },
    { title: 'CRPF Head Constable 2025', org: 'CRPF', vacancies: 1458, lastDate: '2025-08-01', slug: 'crpf-hc-2025', education: '12th Pass' },
    { title: 'BSF Constable Tradesman 2025', org: 'BSF', vacancies: 2788, lastDate: '2025-07-20', slug: 'bsf-constable-2025', education: '10th Pass / ITI' },
    { title: 'Air Force AFCAT 2025', org: 'Indian Air Force', vacancies: 334, lastDate: '2025-07-05', slug: 'afcat-2025', education: 'Graduate' },
  ],
  teaching: [
    { title: 'KVS Teacher Recruitment 2025', org: 'Kendriya Vidyalaya Sangathan', vacancies: 13404, lastDate: '2025-08-15', slug: 'kvs-teacher-2025', education: 'Graduate / B.Ed' },
    { title: 'NVS Teacher Recruitment 2025', org: 'Navodaya Vidyalaya Samiti', vacancies: 4750, lastDate: '2025-07-30', slug: 'nvs-teacher-2025', education: 'Graduate / B.Ed' },
    { title: 'CTET December 2025', org: 'CBSE', vacancies: 0, lastDate: '2025-09-30', slug: 'ctet-dec-2025', education: 'Graduate / D.El.Ed' },
    { title: 'DSSSB TGT/PGT 2025', org: 'DSSSB', vacancies: 3540, lastDate: '2025-08-20', slug: 'dsssb-tgt-pgt-2025', education: 'Graduate / Post Graduate' },
    { title: 'UP TET 2025 - Teacher Eligibility Test', org: 'UP Basic Education Board', vacancies: 0, lastDate: '2025-07-15', slug: 'up-tet-2025', education: 'Graduate / B.Ed' },
    { title: 'Army Public School Teacher 2025', org: 'AWES', vacancies: 8700, lastDate: '2025-10-01', slug: 'aps-teacher-2025', education: 'Graduate / B.Ed' },
  ],
};

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = CATEGORY_MAP[slug];
  if (!cat) return {};
  return generatePageMetadata(
    `${cat.name} Jobs 2025`,
    `Browse ${formatIndianNumber(cat.stats.totalVacancies)}+ ${cat.name} job vacancies. ${cat.description}. Apply online for latest sarkari naukri in ${cat.name} sector.`,
    `/category/${slug}`
  );
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const cat = CATEGORY_MAP[slug];

  if (!cat) {
    notFound();
  }

  const subcategories = SUBCATEGORIES_MAP[slug] || [];
  const featuredJobs = FEATURED_JOBS_MAP[slug] || [];

  const colorClasses: Record<string, { badge: string; bg: string; text: string; border: string }> = {
    blue: { badge: 'badge-blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    green: { badge: 'badge-green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    purple: { badge: 'bg-purple-100 text-purple-800', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    red: { badge: 'badge-red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    yellow: { badge: 'bg-yellow-100 text-yellow-800', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  };

  const colors = colorClasses[cat.color] || colorClasses.blue;

  return (
    <>
      {/* Category Header */}
      <section className={`bg-gradient-to-br ${cat.gradient} py-16 text-white`}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span>Categories</span>
            <span>/</span>
            <span className="text-white font-medium">{cat.name}</span>
          </div>

          <div className="mt-6 flex items-start gap-5">
            <div className="hidden text-6xl sm:block">{cat.icon}</div>
            <div>
              <h1 className="text-3xl font-extrabold md:text-5xl">{cat.name} Jobs 2025</h1>
              <p className="mt-2 max-w-2xl text-lg text-white/80">{cat.description}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-3 gap-4 sm:max-w-xl">
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-extrabold">{formatIndianNumber(cat.stats.activeJobs)}</p>
              <p className="text-xs text-white/70">Active Jobs</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-extrabold">{formatIndianNumber(cat.stats.totalVacancies)}</p>
              <p className="text-xs text-white/70">Total Vacancies</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-lg font-extrabold">{cat.stats.avgSalary}</p>
              <p className="text-xs text-white/70">Salary Range (INR)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">
          {slug === 'state-govt' ? 'Popular State Commissions' : `${cat.name} Sub-Categories`}
        </h2>
        <p className="mt-1 text-gray-600">
          Browse jobs by {slug === 'state-govt' ? 'state commission' : 'recruiting organization'}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {subcategories.map((sub) => (
            <Link
              key={sub}
              href={`/jobs?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`}
              className={`flex items-center gap-3 rounded-lg border ${colors.border} ${colors.bg} p-4 transition hover:shadow-md`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ${colors.text} text-sm font-bold shadow-sm`}>
                {sub.substring(0, 3)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{sub}</p>
                <p className="text-xs text-gray-500">View all jobs</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Featured {cat.name} Jobs</h2>
              <p className="mt-1 text-gray-600">Latest high-vacancy {cat.name.toLowerCase()} recruitment notifications</p>
            </div>
            <Link
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="btn-primary hidden sm:inline-flex"
            >
              View All {cat.name} Jobs
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="card group">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg} text-sm font-bold ${colors.text}`}>
                    {job.org.charAt(0)}
                  </div>
                  <span className={`badge ${colors.badge}`}>{cat.name}</span>
                </div>
                <h3 className="mt-3 font-bold text-gray-900 group-hover:text-primary-600">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">{job.org}</p>
                <p className="mt-1 text-xs text-gray-500">Education: {job.education}</p>
                <div className="mt-3 flex items-center justify-between">
                  {job.vacancies > 0 ? (
                    <span className="badge-green font-bold">
                      {formatIndianNumber(job.vacancies)} Posts
                    </span>
                  ) : (
                    <span className="badge-orange font-bold">Eligibility Test</span>
                  )}
                  <span className="text-xs font-semibold text-red-600">
                    Last Date: {new Date(job.lastDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="btn-primary"
            >
              View All {cat.name} Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* About This Category */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">About {cat.name} Jobs</h2>
        <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
          <p>{cat.longDescription}</p>
          <p>
            NaukriAlert AI tracks all {cat.name.toLowerCase()} job notifications in real time. Our AI engine
            processes updates from official sources every 2 hours so you never miss an application deadline.
            Create a free profile to receive personalized alerts for {cat.name.toLowerCase()} jobs matching
            your qualifications.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/profile" className="btn-primary">
            Get Personalized Alerts
          </Link>
          <Link
            href={`/jobs?category=${encodeURIComponent(cat.name)}`}
            className="btn-outline"
          >
            Browse All {cat.name} Jobs
          </Link>
        </div>
      </section>
    </>
  );
}
