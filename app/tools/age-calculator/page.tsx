import type { Metadata } from 'next';
import Link from 'next/link';
import AgeCalculator from '@/components/AgeCalculator';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Age Calculator for Government Jobs - Check Eligibility',
  'Calculate your exact age for government job exams. Check age eligibility with category-wise relaxation for SC, ST, OBC, PwD, Ex-Serviceman for SSC, UPSC, Banking, Railway exams.',
  '/tools/age-calculator'
);

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Tools', url: '/tools' },
  { name: 'Age Calculator', url: '/tools/age-calculator' },
];

const AGE_LIMIT_DATA = [
  { exam: 'SSC CGL', minAge: 18, maxAge: 32, org: 'Staff Selection Commission' },
  { exam: 'SSC CHSL', minAge: 18, maxAge: 27, org: 'Staff Selection Commission' },
  { exam: 'SSC MTS', minAge: 18, maxAge: 25, org: 'Staff Selection Commission' },
  { exam: 'SSC GD Constable', minAge: 18, maxAge: 23, org: 'Staff Selection Commission' },
  { exam: 'UPSC CSE (IAS)', minAge: 21, maxAge: 32, org: 'Union Public Service Commission' },
  { exam: 'IBPS PO', minAge: 20, maxAge: 30, org: 'IBPS' },
  { exam: 'IBPS Clerk', minAge: 20, maxAge: 28, org: 'IBPS' },
  { exam: 'SBI PO', minAge: 21, maxAge: 30, org: 'State Bank of India' },
  { exam: 'RRB NTPC', minAge: 18, maxAge: 33, org: 'Railway Recruitment Board' },
  { exam: 'RRB Group D', minAge: 18, maxAge: 33, org: 'Railway Recruitment Board' },
  { exam: 'NDA', minAge: 16, maxAge: 19, org: 'UPSC' },
  { exam: 'CDS', minAge: 19, maxAge: 25, org: 'UPSC' },
  { exam: 'Indian Army Agniveer', minAge: 17, maxAge: 21, org: 'Indian Army' },
  { exam: 'CTET', minAge: 18, maxAge: 0, org: 'CBSE (No upper limit)' },
];

export default function AgeCalculatorPage() {
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
            Age Calculator for Government Jobs
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Calculate your exact age on any reference date and check eligibility for all major
            government exams with category-wise age relaxation details.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card">
          <h2 className="section-title mb-6">Calculate Your Age</h2>
          <AgeCalculator />
        </div>
      </section>

      {/* Age Limits Info */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Age Limits for Major Government Exams</h2>
          <p className="mt-2 text-gray-600">
            Age limits vary across exams and are calculated as on a specific reference date mentioned
            in the official notification. Below are the age limits for General (UR) category candidates.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Exam Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Conducting Body</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Min Age</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Max Age (General)</th>
                </tr>
              </thead>
              <tbody>
                {AGE_LIMIT_DATA.map((row) => (
                  <tr key={row.exam} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.exam}</td>
                    <td className="px-4 py-3 text-gray-600">{row.org}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{row.minAge} yrs</td>
                    <td className="px-4 py-3 text-center text-gray-900">
                      {row.maxAge > 0 ? `${row.maxAge} yrs` : 'No limit'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Age Relaxation Table */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900">Category-wise Age Relaxation</h3>
            <p className="mt-2 text-sm text-gray-600">
              Age relaxation is provided over and above the upper age limit for reserved categories
              as per Government of India rules.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { category: 'OBC (Non-Creamy Layer)', relaxation: '3 years', color: 'bg-blue-50 border-blue-200' },
                { category: 'SC / ST', relaxation: '5 years', color: 'bg-green-50 border-green-200' },
                { category: 'PwD (General)', relaxation: '10 years', color: 'bg-purple-50 border-purple-200' },
                { category: 'PwD (OBC)', relaxation: '13 years', color: 'bg-purple-50 border-purple-200' },
                { category: 'PwD (SC/ST)', relaxation: '15 years', color: 'bg-purple-50 border-purple-200' },
                { category: 'Ex-Serviceman', relaxation: '5 years (after deducting military service)', color: 'bg-orange-50 border-orange-200' },
                { category: 'J&K Domicile (1980-89)', relaxation: '5 years', color: 'bg-yellow-50 border-yellow-200' },
                { category: 'Govt Employees', relaxation: 'Up to 5 years (as per rules)', color: 'bg-gray-50 border-gray-200' },
                { category: 'Widows / Divorced Women', relaxation: 'Up to 35 years (for Group C)', color: 'bg-pink-50 border-pink-200' },
              ].map((item) => (
                <div key={item.category} className={`rounded-lg border p-4 ${item.color}`}>
                  <h4 className="font-semibold text-gray-900">{item.category}</h4>
                  <p className="mt-1 text-sm font-medium text-gray-700">{item.relaxation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-10 card">
            <h3 className="text-lg font-bold text-gray-900">Important Notes About Age Calculation</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                <span>Age is always calculated as on a specific date mentioned in the notification, not the application date.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                <span>For SSC exams, the reference date is usually 1st January or 1st August of the exam year.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                <span>For UPSC exams, age is calculated as on 1st August of the year the notification is issued.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                <span>Banking exams (IBPS/SBI) typically calculate age as on 1st of the month in which notification is released.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                <span>Always verify the exact reference date from the official notification before applying.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">Related Tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/tools/salary-calculator" className="card group text-center">
            <div className="text-3xl">💰</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Salary Calculator</h3>
            <p className="mt-1 text-sm text-gray-600">7th CPC salary calculator</p>
          </Link>
          <Link href="/calendar" className="card group text-center">
            <div className="text-3xl">🗓️</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Exam Calendar</h3>
            <p className="mt-1 text-sm text-gray-600">Upcoming government exam dates</p>
          </Link>
          <Link href="/preparation" className="card group text-center">
            <div className="text-3xl">📖</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Study Material</h3>
            <p className="mt-1 text-sm text-gray-600">Free preparation resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
