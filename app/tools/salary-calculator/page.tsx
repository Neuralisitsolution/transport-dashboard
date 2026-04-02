import type { Metadata } from 'next';
import Link from 'next/link';
import SalaryCalculator from '@/components/SalaryCalculator';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Government Salary Calculator - 7th CPC Pay Calculator',
  'Calculate your in-hand government salary under 7th CPC. Get detailed breakdown of Basic Pay, DA, HRA, TA, NPS deductions for all Pay Levels 1-18.',
  '/tools/salary-calculator'
);

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Tools', url: '/tools' },
  { name: 'Salary Calculator', url: '/tools/salary-calculator' },
];

const PAY_LEVEL_INFO = [
  { level: '1-5', posts: 'Group C - MTS, Postman, LDC, DEO', range: '18,000 - 92,300' },
  { level: '6-8', posts: 'Group B - UDC, Inspector, SO, ASO', range: '35,400 - 1,51,100' },
  { level: '9-11', posts: 'Group A - Section Officer, AO, AAO', range: '53,100 - 2,08,700' },
  { level: '12-14', posts: 'Group A - Deputy Secretary, Director, JS', range: '78,800 - 2,18,200' },
  { level: '15-18', posts: 'Senior Administrative - Secretary level', range: '1,82,200 - 2,50,000' },
];

export default function SalaryCalculatorPage() {
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
            Government Salary Calculator - 7th CPC
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Calculate your exact in-hand salary for any government post. Includes DA, HRA,
            TA, NPS deductions, and income tax estimation for all 18 Pay Levels.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="card">
          <h2 className="section-title mb-6">Calculate Your Salary</h2>
          <SalaryCalculator />
        </div>
      </section>

      {/* 7th CPC Info */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Understanding 7th CPC Pay Structure</h2>
          <p className="mt-2 text-gray-600">
            The 7th Central Pay Commission (CPC) was implemented from 1st January 2016 and applies
            to all Central Government employees. It replaced the earlier Grade Pay system with a
            simplified Pay Level matrix comprising 18 levels.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Pay Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Applicable Posts</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Pay Range (Monthly)</th>
                </tr>
              </thead>
              <tbody>
                {PAY_LEVEL_INFO.map((row) => (
                  <tr key={row.level} className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-900">Level {row.level}</td>
                    <td className="px-4 py-3 text-gray-600">{row.posts}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">&#8377;{row.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900">Key Allowances</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span><strong>Dearness Allowance (DA):</strong> Revised twice a year (Jan &amp; Jul). Currently around 50% of Basic Pay.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span><strong>House Rent Allowance (HRA):</strong> 27% (X cities), 18% (Y cities), 9% (Z cities) of Basic Pay.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span><strong>Transport Allowance (TA):</strong> Ranges from Rs. 3,600 to Rs. 14,400 based on Pay Level.</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900">Common Deductions</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span><strong>NPS (National Pension System):</strong> 10% of Basic Pay deducted, with equal government contribution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span><strong>CGHS:</strong> Central Government Health Scheme contribution varies by Pay Level.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span><strong>Income Tax:</strong> As per applicable income tax slab under new or old regime.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 card">
            <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">What is the minimum salary in government jobs?</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Under the 7th CPC, the minimum basic pay is Rs. 18,000 per month (Pay Level 1), applicable
                  to Multi-Tasking Staff (MTS) and similar Group C posts. With DA and other allowances, the
                  gross salary is approximately Rs. 30,000-35,000 per month.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">When is the 8th Pay Commission expected?</h4>
                <p className="mt-1 text-sm text-gray-600">
                  The 8th Pay Commission is expected to be implemented around 2026. It is likely to increase
                  the minimum basic pay significantly with a fitment factor of 2.57x or higher.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">How is DA calculated?</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Dearness Allowance is calculated as a percentage of Basic Pay. It is revised twice a year
                  based on the All India Consumer Price Index (AICPI). The formula is:
                  DA% = [(Average AICPI for past 12 months - 261.42) / 261.42] x 100.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">Related Tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/tools/age-calculator" className="card group text-center">
            <div className="text-3xl">📅</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Age Calculator</h3>
            <p className="mt-1 text-sm text-gray-600">Check age eligibility for govt exams</p>
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
