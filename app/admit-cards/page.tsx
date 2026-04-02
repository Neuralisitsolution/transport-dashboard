import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Government Exam Admit Cards 2025 - Download Hall Tickets',
  'Download latest government exam admit cards and hall tickets. Get direct links for SSC, UPSC, IBPS, SBI, Railway, Defence, and State PSC admit cards with step-by-step download instructions.',
  '/admit-cards'
);

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Admit Cards', url: '/admit-cards' },
];

interface AdmitCardEntry {
  exam: string;
  organization: string;
  releaseDate: string;
  examDate: string;
  status: 'Available' | 'Expected' | 'Released';
  downloadUrl: string;
}

const ADMIT_CARDS: AdmitCardEntry[] = [
  {
    exam: 'SSC CGL 2025 Tier-1',
    organization: 'Staff Selection Commission',
    releaseDate: '2025-08-20',
    examDate: '2025-09-01',
    status: 'Available',
    downloadUrl: 'https://ssc.nic.in',
  },
  {
    exam: 'IBPS PO 2025 Prelims',
    organization: 'IBPS',
    releaseDate: '2025-08-01',
    examDate: '2025-08-15',
    status: 'Available',
    downloadUrl: 'https://ibps.in',
  },
  {
    exam: 'UPSC CSE 2025 Prelims',
    organization: 'UPSC',
    releaseDate: '2025-06-18',
    examDate: '2025-07-01',
    status: 'Released',
    downloadUrl: 'https://upsc.gov.in',
  },
  {
    exam: 'RRB NTPC 2025 CBT-1',
    organization: 'Railway Recruitment Board',
    releaseDate: '2025-07-08',
    examDate: '2025-07-20',
    status: 'Available',
    downloadUrl: 'https://rrbcdg.gov.in',
  },
  {
    exam: 'SBI PO 2025 Prelims',
    organization: 'State Bank of India',
    releaseDate: '2025-07-20',
    examDate: '2025-08-01',
    status: 'Available',
    downloadUrl: 'https://sbi.co.in',
  },
  {
    exam: 'NDA 2 Exam 2025',
    organization: 'UPSC',
    releaseDate: '2025-08-05',
    examDate: '2025-08-15',
    status: 'Expected',
    downloadUrl: 'https://upsc.gov.in',
  },
  {
    exam: 'SSC CHSL 2025 Tier-1',
    organization: 'Staff Selection Commission',
    releaseDate: '2025-09-01',
    examDate: '2025-09-15',
    status: 'Expected',
    downloadUrl: 'https://ssc.nic.in',
  },
  {
    exam: 'IBPS Clerk 2025 Prelims',
    organization: 'IBPS',
    releaseDate: '2025-09-25',
    examDate: '2025-10-05',
    status: 'Expected',
    downloadUrl: 'https://ibps.in',
  },
  {
    exam: 'SSC GD Constable 2025',
    organization: 'Staff Selection Commission',
    releaseDate: '2025-10-01',
    examDate: '2025-10-15',
    status: 'Expected',
    downloadUrl: 'https://ssc.nic.in',
  },
  {
    exam: 'KVS Teacher 2025',
    organization: 'Kendriya Vidyalaya Sangathan',
    releaseDate: '2025-08-10',
    examDate: '2025-08-25',
    status: 'Expected',
    downloadUrl: 'https://kvsangathan.nic.in',
  },
];

function getStatusBadgeClass(status: AdmitCardEntry['status']): string {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800';
    case 'Released':
      return 'bg-blue-100 text-blue-800';
    case 'Expected':
      return 'bg-yellow-100 text-yellow-800';
  }
}

export default function AdmitCardsPage() {
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
            Government Exam Admit Cards 2025
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Download admit cards and hall tickets for all major government exams. Get direct
            download links and step-by-step instructions.
          </p>
        </div>
      </section>

      {/* Admit Cards Table */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="section-title">Latest Admit Cards</h2>
        <p className="mt-2 text-gray-600">
          Click the download link to visit the official website and download your admit card.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Exam Name</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-gray-700 md:table-cell">
                  Organization
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Exam Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Download</th>
              </tr>
            </thead>
            <tbody>
              {ADMIT_CARDS.map((card) => (
                <tr key={card.exam} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{card.exam}</p>
                    <p className="text-xs text-gray-500 md:hidden">{card.organization}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {card.organization}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(card.examDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        card.status
                      )}`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {card.status === 'Available' || card.status === 'Released' ? (
                      <a
                        href={card.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Not yet available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips for Downloading Admit Cards */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Tips for Downloading Admit Cards</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900">Steps to Download</h3>
              <ol className="mt-3 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    1
                  </span>
                  <span>Visit the official website of the conducting organization.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    2
                  </span>
                  <span>Click on the &quot;Download Admit Card&quot; or &quot;Hall Ticket&quot; link.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    3
                  </span>
                  <span>Enter your Registration Number, Date of Birth, or other required details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    4
                  </span>
                  <span>Download and take a colour printout on A4 size paper.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    5
                  </span>
                  <span>Verify all details such as name, photo, exam centre, and timing.</span>
                </li>
              </ol>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900">Important Reminders</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>
                    Always download admit cards well before the exam date. Servers can be slow on the last day.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>
                    Keep multiple printouts of your admit card. Also save a copy on your phone.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>
                    Carry a valid photo ID (Aadhaar, Voter ID, Passport, or Driving Licence) along with the admit card.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>
                    Check the reporting time and exam centre address in advance. Plan your travel accordingly.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>
                    If there is any discrepancy in your admit card, contact the exam authority immediately.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>
                    Do not discard your admit card after the exam. It is required for subsequent stages and document verification.
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
          <Link href="/calendar" className="card group text-center">
            <div className="text-3xl">🗓️</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Exam Calendar</h3>
            <p className="mt-1 text-sm text-gray-600">View upcoming exam dates</p>
          </Link>
          <Link href="/results" className="card group text-center">
            <div className="text-3xl">📊</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Results</h3>
            <p className="mt-1 text-sm text-gray-600">Check latest exam results</p>
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
