import type { Metadata } from 'next';
import Link from 'next/link';
import ExamCalendar from '@/components/ExamCalendar';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Government Exam Calendar 2025-26 - Upcoming Exam Dates & Schedule',
  'Stay updated with the complete government exam calendar for 2025-26. View upcoming exam dates, application deadlines, admit card releases, and result dates for SSC, UPSC, Banking, Railway, and Defence exams.',
  '/calendar'
);

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Exam Calendar', url: '/calendar' },
];

const UPCOMING_EXAMS = [
  { exam: 'SSC CGL Tier-1', date: '2025-09-01', status: 'Confirmed', category: 'Central Govt' },
  { exam: 'IBPS PO Prelims', date: '2025-08-15', status: 'Tentative', category: 'Banking' },
  { exam: 'UPSC CSE Prelims', date: '2025-07-01', status: 'Confirmed', category: 'Central Govt' },
  { exam: 'SBI PO Prelims', date: '2025-08-01', status: 'Confirmed', category: 'Banking' },
  { exam: 'NDA 2 Exam 2025', date: '2025-08-15', status: 'Confirmed', category: 'Defence' },
  { exam: 'RRB NTPC CBT-1', date: '2025-07-20', status: 'Tentative', category: 'Central Govt' },
  { exam: 'SSC CHSL Tier-1', date: '2025-09-15', status: 'Tentative', category: 'Central Govt' },
  { exam: 'IBPS Clerk Prelims', date: '2025-10-05', status: 'Tentative', category: 'Banking' },
];

const IMPORTANT_DEADLINES = [
  { event: 'SSC CGL 2025 Application Last Date', date: '2025-07-15', type: 'Deadline' },
  { event: 'UPSC CSE 2025 Application Last Date', date: '2025-06-20', type: 'Deadline' },
  { event: 'IBPS PO 2025 Registration Starts', date: '2025-06-20', type: 'Opens' },
  { event: 'RRB NTPC 2025 Registration Ends', date: '2025-06-30', type: 'Deadline' },
  { event: 'SBI PO Admit Card Release', date: '2025-07-20', type: 'Admit Card' },
  { event: 'Indian Army Agniveer Rally', date: '2025-07-10', type: 'Deadline' },
];

export default function CalendarPage() {
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
            Government Exam Calendar 2025-26
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Complete schedule of upcoming government exams, application deadlines, admit card
            releases, and result dates. Never miss an important date.
          </p>
        </div>
      </section>

      {/* Upcoming Exams in Next 30 Days */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="section-title">Upcoming Exams &amp; Deadlines</h2>
        <p className="mt-2 text-gray-600">
          Important dates you should not miss in the coming weeks.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Upcoming Exams */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Exams</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Exam</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_EXAMS.map((row) => (
                    <tr key={row.exam} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{row.exam}</td>
                      <td className="px-3 py-2 text-gray-600">
                        {new Date(row.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Deadlines */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900">Important Deadlines</h3>
            <div className="mt-4 space-y-3">
              {IMPORTANT_DEADLINES.map((item) => (
                <div
                  key={item.event}
                  className="flex items-start justify-between gap-4 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.type === 'Deadline'
                        ? 'bg-red-100 text-red-800'
                        : item.type === 'Admit Card'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Calendar */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Full Exam Calendar</h2>
          <p className="mt-2 text-gray-600">
            Filter by category to see relevant exam dates. Click on any event for more details.
          </p>
          <div className="mt-6 card">
            <ExamCalendar />
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">Tips for Exam Preparation Planning</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Start Early',
              description:
                'Begin your preparation at least 6 months before the exam date. Create a study plan and stick to it consistently.',
            },
            {
              title: 'Track Deadlines',
              description:
                'Mark application deadlines, admit card dates, and exam dates in your personal calendar to avoid missing any important date.',
            },
            {
              title: 'Attempt Multiple Exams',
              description:
                'Many government exams have overlapping syllabus. Preparing for one exam can help you crack multiple exams in the same period.',
            },
            {
              title: 'Focus on Mock Tests',
              description:
                'Start taking mock tests 2-3 months before the exam. Analyze your performance and work on weak areas.',
            },
            {
              title: 'Stay Updated',
              description:
                'Exam dates can change. Subscribe to our alerts to get notified about any schedule changes or new notifications.',
            },
            {
              title: 'Health Matters',
              description:
                'Maintain a healthy routine. Regular exercise, proper sleep, and balanced diet improve your concentration and performance.',
            },
          ].map((tip) => (
            <div key={tip.title} className="card">
              <h3 className="font-bold text-gray-900">{tip.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Links */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Related Resources</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link href="/admit-cards" className="card group text-center">
              <div className="text-3xl">🎫</div>
              <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Admit Cards</h3>
              <p className="mt-1 text-sm text-gray-600">Download latest admit cards</p>
            </Link>
            <Link href="/results" className="card group text-center">
              <div className="text-3xl">📊</div>
              <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Results</h3>
              <p className="mt-1 text-sm text-gray-600">Check latest exam results</p>
            </Link>
            <Link href="/preparation" className="card group text-center">
              <div className="text-3xl">📖</div>
              <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Study Material</h3>
              <p className="mt-1 text-sm text-gray-600">Free preparation resources</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
