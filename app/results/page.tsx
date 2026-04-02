import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Government Exam Results 2025 - Check Latest Results & Cut-Off',
  'Check latest government exam results, cut-off marks, and merit lists. Get direct links for SSC, UPSC, IBPS, SBI, Railway, Defence, and State PSC exam results with category-wise cut-off details.',
  '/results'
);

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Results', url: '/results' },
];

interface ResultEntry {
  exam: string;
  organization: string;
  resultDate: string;
  status: 'Declared' | 'Expected' | 'Upcoming';
  cutOffUrl: string;
  resultUrl: string;
}

const RESULTS: ResultEntry[] = [
  {
    exam: 'SSC CGL 2024 Tier-2 Final',
    organization: 'Staff Selection Commission',
    resultDate: '2025-05-15',
    status: 'Declared',
    cutOffUrl: 'https://ssc.nic.in',
    resultUrl: 'https://ssc.nic.in',
  },
  {
    exam: 'UPSC CSE 2024 Final Result',
    organization: 'UPSC',
    resultDate: '2025-04-20',
    status: 'Declared',
    cutOffUrl: 'https://upsc.gov.in',
    resultUrl: 'https://upsc.gov.in',
  },
  {
    exam: 'IBPS PO 2024 Mains',
    organization: 'IBPS',
    resultDate: '2025-05-01',
    status: 'Declared',
    cutOffUrl: 'https://ibps.in',
    resultUrl: 'https://ibps.in',
  },
  {
    exam: 'SBI Clerk 2024 Final',
    organization: 'State Bank of India',
    resultDate: '2025-04-10',
    status: 'Declared',
    cutOffUrl: 'https://sbi.co.in',
    resultUrl: 'https://sbi.co.in',
  },
  {
    exam: 'RRB NTPC 2024 CBT-2',
    organization: 'Railway Recruitment Board',
    resultDate: '2025-06-01',
    status: 'Declared',
    cutOffUrl: 'https://rrbcdg.gov.in',
    resultUrl: 'https://rrbcdg.gov.in',
  },
  {
    exam: 'SSC CHSL 2024 Final',
    organization: 'Staff Selection Commission',
    resultDate: '2025-06-10',
    status: 'Declared',
    cutOffUrl: 'https://ssc.nic.in',
    resultUrl: 'https://ssc.nic.in',
  },
  {
    exam: 'UPSC CSE 2025 Prelims',
    organization: 'UPSC',
    resultDate: '2025-08-01',
    status: 'Expected',
    cutOffUrl: 'https://upsc.gov.in',
    resultUrl: 'https://upsc.gov.in',
  },
  {
    exam: 'SSC CGL 2025 Tier-1',
    organization: 'Staff Selection Commission',
    resultDate: '2025-10-15',
    status: 'Upcoming',
    cutOffUrl: 'https://ssc.nic.in',
    resultUrl: 'https://ssc.nic.in',
  },
  {
    exam: 'IBPS PO 2025 Prelims',
    organization: 'IBPS',
    resultDate: '2025-09-10',
    status: 'Expected',
    cutOffUrl: 'https://ibps.in',
    resultUrl: 'https://ibps.in',
  },
  {
    exam: 'NDA 1 2025 Written',
    organization: 'UPSC',
    resultDate: '2025-07-20',
    status: 'Expected',
    cutOffUrl: 'https://upsc.gov.in',
    resultUrl: 'https://upsc.gov.in',
  },
];

function getStatusBadgeClass(status: ResultEntry['status']): string {
  switch (status) {
    case 'Declared':
      return 'bg-green-100 text-green-800';
    case 'Expected':
      return 'bg-yellow-100 text-yellow-800';
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800';
  }
}

export default function ResultsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          {breadcrumbItems.map((item, index) => (
            <li key={item.url} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400">/</span>}
              {index < breadcrumbItems.length - 1 ? (
                <Link href={item.url} className="hover:text-primary-600">
                  {item.name}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Government Exam Results 2025
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Check latest exam results, cut-off marks, and merit lists for all major government
            exams. Get direct links to official result portals.
          </p>
        </div>
      </section>

      {/* Results Table */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="section-title">Latest Exam Results</h2>
        <p className="mt-2 text-gray-600">
          Click on the result or cut-off link to visit the official website.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Exam Name</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-gray-700 md:table-cell">
                  Organization
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Result Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Cut-Off</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((result) => (
                <tr key={result.exam} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{result.exam}</p>
                    <p className="text-xs text-gray-500 md:hidden">{result.organization}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {result.organization}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(result.resultDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        result.status
                      )}`}
                    >
                      {result.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {result.status === 'Declared' ? (
                      <a
                        href={result.cutOffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        View Cut-Off
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Awaited</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Steps After Result */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Steps After Result Announcement</h2>
          <p className="mt-2 text-gray-600">
            Follow these steps after the result is declared to ensure you do not miss the next stage.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Check Your Result',
                description:
                  'Visit the official website and enter your roll number or registration details to check your result. Download the scorecard for your records.',
              },
              {
                step: '2',
                title: 'Verify Cut-Off Marks',
                description:
                  'Compare your score with the category-wise cut-off marks. Cut-off varies by category (General, OBC, SC, ST, PwD) and sometimes by region.',
              },
              {
                step: '3',
                title: 'Prepare for Next Stage',
                description:
                  'If selected, start preparing for the next stage (Tier-2, Mains, Interview, or Skill Test) immediately. Check the exam pattern and syllabus.',
              },
              {
                step: '4',
                title: 'Gather Documents',
                description:
                  'Keep all original documents ready including educational certificates, caste certificate, domicile, identity proof, and photographs.',
              },
              {
                step: '5',
                title: 'Watch for DV Schedule',
                description:
                  'Document Verification (DV) dates are announced after the final result. Keep checking the official website for the DV schedule and venue details.',
              },
              {
                step: '6',
                title: 'Medical Examination',
                description:
                  'Some posts require a medical examination. Ensure you are medically fit as per the prescribed standards for the post you have been selected for.',
              },
            ].map((item) => (
              <div key={item.step} className="card">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Common Cut-Off Trends */}
          <div className="mt-10 card">
            <h3 className="text-lg font-bold text-gray-900">Understanding Cut-Off Marks</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                Cut-off marks represent the minimum score required to qualify for the next stage of a
                government exam. They are determined by several factors:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  <span>
                    <strong>Number of Vacancies:</strong> More vacancies generally lead to lower cut-off marks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  <span>
                    <strong>Difficulty Level:</strong> A tougher paper usually results in a lower cut-off.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  <span>
                    <strong>Number of Candidates:</strong> Higher competition leads to higher cut-off marks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  <span>
                    <strong>Category:</strong> Reserved categories (OBC, SC, ST, PwD) have lower cut-off marks than the General category.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">Related Pages</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/admit-cards" className="card group text-center">
            <div className="text-3xl">🎫</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Admit Cards</h3>
            <p className="mt-1 text-sm text-gray-600">Download latest admit cards</p>
          </Link>
          <Link href="/calendar" className="card group text-center">
            <div className="text-3xl">🗓️</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Exam Calendar</h3>
            <p className="mt-1 text-sm text-gray-600">View upcoming exam dates</p>
          </Link>
          <Link href="/preparation" className="card group text-center">
            <div className="text-3xl">📖</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Preparation</h3>
            <p className="mt-1 text-sm text-gray-600">Study material and resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
