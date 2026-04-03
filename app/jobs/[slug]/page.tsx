import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatIndianNumber, formatDate, getCategoryColor } from '@/lib/constants';
import { generatePageMetadata, generateJobPostingSchema, generateBreadcrumbSchema } from '@/lib/seo-helpers';
import EligibilityChecker from '@/components/EligibilityChecker';
import CountdownTimer from '@/components/CountdownTimer';

export const dynamic = 'force-dynamic';

interface JobData {
  title: string;
  slug: string;
  organization: string;
  department: string;
  category: string;
  subCategory: string;
  totalVacancies: number;
  eligibility: {
    age: { min: number; max: number };
    ageRelaxation: string;
    education: string;
    experience: string;
  };
  importantDates: {
    notificationDate: string;
    applicationStart: string;
    applicationEnd: string;
    examDate: string;
    admitCardDate: string;
    resultDate: string;
  };
  applicationFee: {
    general: number;
    obc: number;
    scSt: number;
    female: number;
    exServiceman: number;
  };
  salary: {
    payScale: string;
    minSalary: number;
    maxSalary: number;
    inHandEstimate: number;
  };
  location: string;
  applyOnlineLink: string;
  officialNotificationLink: string;
  officialWebsite: string;
  examPattern: string;
  selectionProcess: string;
  statesAccepted: string[];
  isActive: boolean;
  isFeatured: boolean;
  views: number;
}

async function getJob(slug: string): Promise<JobData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/jobs/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.job || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return generatePageMetadata('Job Not Found', 'This job posting could not be found.', `/jobs/${slug}`);
  return generatePageMetadata(
    `${job.title} - ${job.organization} Recruitment`,
    `Apply for ${job.title} at ${job.organization}. ${job.totalVacancies > 0 ? job.totalVacancies + ' vacancies.' : ''} Complete details, eligibility, and direct apply link.`,
    `/jobs/${slug}`
  );
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) notFound();

  const jobPostingSchema = generateJobPostingSchema({
    title: job.title,
    organization: job.organization,
    description: `${job.title} recruitment by ${job.organization}. ${job.totalVacancies > 0 ? job.totalVacancies + ' vacancies.' : ''}`,
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

  const hasApplyLink = job.applyOnlineLink && job.applyOnlineLink.startsWith('http');
  const hasNotificationLink = job.officialNotificationLink && job.officialNotificationLink.startsWith('http');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600">Jobs</Link>
          <span>/</span>
          <span className="text-gray-900 line-clamp-1">{job.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`badge ${getCategoryColor(job.category)}`}>{job.category}</span>
                    {job.subCategory && <span className="badge bg-gray-100 text-gray-700">{job.subCategory}</span>}
                    {job.isFeatured && <span className="badge bg-primary-100 text-primary-800">Featured</span>}
                    {!job.isActive && <span className="badge bg-red-100 text-red-800">Expired</span>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{job.title}</h1>
                  <p className="mt-1 text-lg text-gray-600">{job.organization}</p>
                  {job.department && <p className="text-sm text-gray-500">{job.department}</p>}
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xl font-bold text-primary-700">
                  {job.organization.charAt(0)}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {job.totalVacancies > 0 && (
                  <div className="rounded-lg bg-green-50 p-3 text-center">
                    <p className="text-xs text-green-600">Vacancies</p>
                    <p className="text-xl font-bold text-green-700">{formatIndianNumber(job.totalVacancies)}</p>
                  </div>
                )}
                {job.salary.inHandEstimate > 0 && (
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-xs text-blue-600">In-Hand Salary</p>
                    <p className="text-xl font-bold text-blue-700">₹{formatIndianNumber(job.salary.inHandEstimate)}</p>
                  </div>
                )}
                {job.importantDates.applicationEnd && (
                  <div className="rounded-lg bg-orange-50 p-3 text-center">
                    <p className="text-xs text-orange-600">Last Date</p>
                    <p className="text-lg font-bold text-orange-700">{formatDate(job.importantDates.applicationEnd)}</p>
                  </div>
                )}
                <div className="rounded-lg bg-purple-50 p-3 text-center">
                  <p className="text-xs text-purple-600">Location</p>
                  <p className="text-lg font-bold text-purple-700">{job.location || 'All India'}</p>
                </div>
              </div>

              {job.importantDates.applicationEnd && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <CountdownTimer targetDate={job.importantDates.applicationEnd} />
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {hasApplyLink && (
                  <a href={job.applyOnlineLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Apply Online
                  </a>
                )}
                {hasNotificationLink && (
                  <a href={job.officialNotificationLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    View Official Notification
                  </a>
                )}
              </div>
            </div>

            {/* Important Dates */}
            {(job.importantDates.applicationStart || job.importantDates.applicationEnd || job.importantDates.examDate) && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900">Important Dates</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Notification Date', date: job.importantDates.notificationDate, icon: '📋' },
                    { label: 'Application Start', date: job.importantDates.applicationStart, icon: '🟢' },
                    { label: 'Application End', date: job.importantDates.applicationEnd, icon: '🔴' },
                    { label: 'Admit Card', date: job.importantDates.admitCardDate, icon: '🎫' },
                    { label: 'Exam Date', date: job.importantDates.examDate, icon: '📝' },
                    { label: 'Result Date', date: job.importantDates.resultDate, icon: '📊' },
                  ].filter(item => item.date).map((item) => (
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
            )}

            {/* Eligibility */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Eligibility Criteria</h2>
              <div className="mt-4 space-y-3">
                {job.eligibility.education && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-700">Education</h3>
                    <p className="mt-1 text-gray-900">{job.eligibility.education}</p>
                  </div>
                )}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Age Limit</h3>
                  <p className="text-gray-900">{job.eligibility.age.min} - {job.eligibility.age.max} years</p>
                  {job.eligibility.ageRelaxation && <p className="mt-1 text-sm text-gray-500">Relaxation: {job.eligibility.ageRelaxation}</p>}
                </div>
                {job.eligibility.experience && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-700">Experience</h3>
                    <p className="text-gray-900">{job.eligibility.experience}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Application Fee */}
            {(job.applicationFee.general > 0 || job.applicationFee.scSt >= 0) && (
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
                        { label: 'Female', fee: job.applicationFee.female },
                        { label: 'Ex-Serviceman', fee: job.applicationFee.exServiceman },
                      ].map((row) => (
                        <tr key={row.label} className="border-b">
                          <td className="px-4 py-3 text-gray-900">{row.label}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {row.fee === 0 ? <span className="text-green-600">FREE</span> : <span>₹{row.fee}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Salary */}
            {(job.salary.minSalary > 0 || job.salary.payScale) && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900">Salary Details</h2>
                {job.salary.payScale && (
                  <p className="mt-2 text-gray-700">Pay Scale: <span className="font-semibold">{job.salary.payScale}</span></p>
                )}
                {job.salary.minSalary > 0 && (
                  <p className="text-gray-700">Range: <span className="font-semibold">₹{formatIndianNumber(job.salary.minSalary)} - ₹{formatIndianNumber(job.salary.maxSalary)}</span></p>
                )}
                {job.salary.inHandEstimate > 0 && (
                  <div className="mt-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-center text-white">
                    <p className="text-sm text-white/80">Estimated In-Hand Salary</p>
                    <p className="text-3xl font-bold">₹{formatIndianNumber(job.salary.inHandEstimate)}/month</p>
                  </div>
                )}
              </div>
            )}

            {/* Exam Pattern & Selection */}
            {(job.examPattern || job.selectionProcess) && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900">Exam & Selection</h2>
                {job.examPattern && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-700">Exam Pattern</h3>
                    <p className="mt-1 whitespace-pre-line text-gray-900">{job.examPattern}</p>
                  </div>
                )}
                {job.selectionProcess && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-700">Selection Process</h3>
                    <p className="mt-1 text-gray-900">{job.selectionProcess}</p>
                  </div>
                )}
              </div>
            )}

            {/* Apply Button */}
            {hasApplyLink && (
              <div className="card text-center">
                <h2 className="text-xl font-bold text-gray-900">Ready to Apply?</h2>
                <p className="mt-2 text-gray-600">Click below to go to the official application page</p>
                <a href={job.applyOnlineLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 inline-flex">
                  Apply Online Now
                </a>
                <p className="mt-2 text-xs text-gray-400">You will be redirected to the official website</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EligibilityChecker job={job} />

            <div className="card">
              <h3 className="font-bold text-gray-900">Quick Info</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  { label: 'Organization', value: job.organization },
                  { label: 'Category', value: job.category },
                  ...(job.totalVacancies > 0 ? [{ label: 'Vacancies', value: formatIndianNumber(job.totalVacancies) }] : []),
                  { label: 'Location', value: job.location || 'All India' },
                  ...(job.views > 0 ? [{ label: 'Views', value: formatIndianNumber(job.views) }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900">Share This Job</h3>
              <div className="mt-3 flex gap-2">
                {[
                  { name: 'WhatsApp', color: 'bg-green-500', href: `https://wa.me/?text=${encodeURIComponent(job.title + ' - Apply Now! ' + (job.applyOnlineLink || ''))}` },
                  { name: 'Telegram', color: 'bg-blue-500', href: `https://t.me/share/url?url=${encodeURIComponent(job.applyOnlineLink || '')}&text=${encodeURIComponent(job.title)}` },
                ].map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`${s.color} rounded-lg px-4 py-2 text-xs font-medium text-white transition hover:opacity-90`}>
                    {s.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Important Links */}
            <div className="card">
              <h3 className="font-bold text-gray-900">Official Links</h3>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Apply Online', href: job.applyOnlineLink },
                  { label: 'Official Notification', href: job.officialNotificationLink },
                  { label: 'Official Website', href: job.officialWebsite },
                ].filter(l => l.href && l.href.startsWith('http')).map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border p-3 text-sm transition hover:bg-gray-50">
                    <span className="text-primary-600 font-medium">{link.label}</span>
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
