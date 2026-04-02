import Link from 'next/link';
import { Metadata } from 'next';
import { formatIndianNumber, formatDate, getCategoryColor } from '@/lib/constants';
import { generatePageMetadata, generateJobPostingSchema, generateBreadcrumbSchema } from '@/lib/seo-helpers';
import EligibilityChecker from '@/components/EligibilityChecker';
import CountdownTimer from '@/components/CountdownTimer';

const SAMPLE_JOB = {
  title: 'SSC CGL 2025',
  slug: 'ssc-cgl-2025',
  organization: 'Staff Selection Commission',
  department: 'Department of Personnel & Training',
  category: 'Central Govt',
  subCategory: 'SSC',
  totalVacancies: 17727,
  eligibility: {
    age: { min: 18, max: 32 },
    ageRelaxation: 'OBC: 3 years, SC/ST: 5 years, PwD: 10 years',
    education: "Bachelor's Degree in any stream from a recognized university",
    experience: 'Not required',
  },
  importantDates: {
    notificationDate: '2025-06-01',
    applicationStart: '2025-06-15',
    applicationEnd: '2025-07-15',
    examDate: '2025-09-01',
    admitCardDate: '2025-08-15',
    resultDate: '2025-11-01',
  },
  applicationFee: { general: 100, obc: 100, scSt: 0, female: 0, exServiceman: 0 },
  salary: { payScale: 'Level 4 to Level 8', minSalary: 25500, maxSalary: 151100, inHandEstimate: 32000 },
  location: 'All India',
  applyOnlineLink: 'https://ssc.nic.in',
  officialNotificationLink: 'https://ssc.nic.in/noticeboards',
  officialWebsite: 'https://ssc.nic.in',
  examPattern: 'Tier 1: Computer Based Test (100 questions, 200 marks, 60 min)\nTier 2: Computer Based Test (Paper I, II, III)',
  selectionProcess: 'Tier 1 CBT → Tier 2 CBT → Document Verification → Final Selection',
  statesAccepted: ['All India'],
  isActive: true,
  isFeatured: true,
  views: 45230,
  createdAt: '2025-06-01',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generatePageMetadata(
    `${SAMPLE_JOB.title} Recruitment`,
    `Apply for ${SAMPLE_JOB.title} at ${SAMPLE_JOB.organization}. ${SAMPLE_JOB.totalVacancies} vacancies. Complete details, eligibility, salary, and apply link.`,
    `/jobs/${slug}`
  );
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = { ...SAMPLE_JOB, slug };

  const jobPostingSchema = generateJobPostingSchema({
    title: job.title,
    organization: job.organization,
    description: `${job.title} recruitment by ${job.organization}. ${job.totalVacancies} vacancies.`,
    location: job.location,
    salary: { min: job.salary.minSalary, max: job.salary.maxSalary },
    applicationEnd: job.importantDates.applicationEnd,
    applicationStart: job.importantDates.applicationStart,
    slug: job.slug,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Jobs', url: '/jobs' },
    { name: job.title, url: `/jobs/${job.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600">Jobs</Link>
          <span>/</span>
          <span className="text-gray-900">{job.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getCategoryColor(job.category)}`}>{job.category}</span>
                    <span className="badge bg-gray-100 text-gray-700">{job.subCategory}</span>
                    {job.isFeatured && <span className="badge bg-primary-100 text-primary-800">Featured</span>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{job.title}</h1>
                  <p className="mt-1 text-lg text-gray-600">{job.organization}</p>
                  <p className="text-sm text-gray-500">{job.department}</p>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-2xl font-bold text-primary-700">
                  {job.organization.charAt(0)}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-green-50 p-3 text-center">
                  <p className="text-xs text-green-600">Total Vacancies</p>
                  <p className="text-xl font-bold text-green-700">{formatIndianNumber(job.totalVacancies)}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <p className="text-xs text-blue-600">In-Hand Salary</p>
                  <p className="text-xl font-bold text-blue-700">₹{formatIndianNumber(job.salary.inHandEstimate)}</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-3 text-center">
                  <p className="text-xs text-orange-600">Last Date</p>
                  <p className="text-lg font-bold text-orange-700">{formatDate(job.importantDates.applicationEnd)}</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3 text-center">
                  <p className="text-xs text-purple-600">Location</p>
                  <p className="text-lg font-bold text-purple-700">{job.location}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <CountdownTimer targetDate={job.importantDates.applicationEnd} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={job.applyOnlineLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Apply Online
                </a>
                <a href={job.officialNotificationLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  View Notification PDF
                </a>
              </div>
            </div>

            {/* Important Dates */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Important Dates</h2>
              <div className="mt-4 space-y-4">
                {[
                  { label: 'Notification Date', date: job.importantDates.notificationDate, icon: '📋' },
                  { label: 'Application Start', date: job.importantDates.applicationStart, icon: '🟢' },
                  { label: 'Application End', date: job.importantDates.applicationEnd, icon: '🔴' },
                  { label: 'Admit Card', date: job.importantDates.admitCardDate, icon: '🎫' },
                  { label: 'Exam Date', date: job.importantDates.examDate, icon: '📝' },
                  { label: 'Result Date', date: job.importantDates.resultDate, icon: '📊' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 rounded-lg border p-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-semibold text-gray-900">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Eligibility Criteria</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Age Limit</h3>
                  <p className="text-gray-900">{job.eligibility.age.min} - {job.eligibility.age.max} years</p>
                  <p className="mt-1 text-sm text-gray-500">Relaxation: {job.eligibility.ageRelaxation}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Education</h3>
                  <p className="text-gray-900">{job.eligibility.education}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Experience</h3>
                  <p className="text-gray-900">{job.eligibility.experience}</p>
                </div>
              </div>
            </div>

            {/* Application Fee */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Application Fee</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'General / OBC', fee: job.applicationFee.general },
                      { label: 'SC / ST', fee: job.applicationFee.scSt },
                      { label: 'Female (All Categories)', fee: job.applicationFee.female },
                      { label: 'Ex-Serviceman', fee: job.applicationFee.exServiceman },
                    ].map((row) => (
                      <tr key={row.label} className="border-b">
                        <td className="px-4 py-3 text-gray-900">{row.label}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {row.fee === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            <span>₹{row.fee}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Salary */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Salary Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-600">Pay Scale</p>
                  <p className="text-lg font-bold text-blue-800">{job.salary.payScale}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-600">Salary Range</p>
                  <p className="text-lg font-bold text-green-800">₹{formatIndianNumber(job.salary.minSalary)} - ₹{formatIndianNumber(job.salary.maxSalary)}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-center text-white">
                <p className="text-sm text-white/80">Estimated In-Hand Salary</p>
                <p className="text-3xl font-bold">₹{formatIndianNumber(job.salary.inHandEstimate)}/month</p>
              </div>
            </div>

            {/* Exam Pattern */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Exam Pattern & Selection Process</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Exam Pattern</h3>
                  <p className="mt-1 whitespace-pre-line text-gray-900">{job.examPattern}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Selection Process</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.selectionProcess.split('→').map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-900">{step.trim()}</span>
                        {i < job.selectionProcess.split('→').length - 1 && (
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* How to Apply */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">How to Apply</h2>
              <ol className="mt-4 space-y-3">
                {[
                  `Visit the official website: ${job.officialWebsite}`,
                  'Click on the "Apply Online" link or navigate to the registration page',
                  'Register with your email ID and mobile number',
                  'Fill in your personal details, educational qualifications, and other required information',
                  'Upload your photograph, signature, and other required documents',
                  `Pay the application fee of ₹${job.applicationFee.general} (if applicable)`,
                  'Review all details carefully and submit the application',
                  'Download and print the confirmation page for future reference',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <a href={job.applyOnlineLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Apply Online Now
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EligibilityChecker job={job} />

            {/* Quick Info */}
            <div className="card">
              <h3 className="font-bold text-gray-900">Quick Info</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  { label: 'Organization', value: job.organization },
                  { label: 'Category', value: job.category },
                  { label: 'Vacancies', value: formatIndianNumber(job.totalVacancies) },
                  { label: 'Location', value: job.location },
                  { label: 'Views', value: formatIndianNumber(job.views) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="card">
              <h3 className="font-bold text-gray-900">Share This Job</h3>
              <div className="mt-3 flex gap-2">
                {[
                  { name: 'WhatsApp', color: 'bg-green-500', href: `https://wa.me/?text=${encodeURIComponent(job.title + ' - Apply Now!')}` },
                  { name: 'Telegram', color: 'bg-blue-500', href: `https://t.me/share/url?url=&text=${encodeURIComponent(job.title)}` },
                  { name: 'Twitter', color: 'bg-sky-500', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(job.title)}` },
                ].map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`${s.color} rounded-lg px-4 py-2 text-xs font-medium text-white transition hover:opacity-90`}>
                    {s.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Important Links */}
            <div className="card">
              <h3 className="font-bold text-gray-900">Important Links</h3>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Apply Online', href: job.applyOnlineLink },
                  { label: 'Official Notification', href: job.officialNotificationLink },
                  { label: 'Official Website', href: job.officialWebsite },
                ].map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border p-3 text-sm transition hover:bg-gray-50">
                    <span className="text-gray-700">{link.label}</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
