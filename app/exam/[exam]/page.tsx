import Link from 'next/link';
import { Metadata } from 'next';
import { MAJOR_EXAMS } from '@/lib/constants';
import { generatePageMetadata, generateFAQSchema } from '@/lib/seo-helpers';

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const { exam } = await params;
  const examData = MAJOR_EXAMS.find((e) => e.slug === exam);
  const name = examData?.name || exam.replace(/-/g, ' ').toUpperCase();
  return generatePageMetadata(
    `${name} 2025 - Complete Guide`,
    `Complete guide for ${name} 2025. Eligibility, syllabus, exam pattern, previous papers, preparation tips, and latest notifications.`,
    `/exam/${exam}`
  );
}

export default async function ExamPage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam } = await params;
  const examData = MAJOR_EXAMS.find((e) => e.slug === exam);
  const name = examData?.name || exam.replace(/-/g, ' ').toUpperCase();
  const org = examData?.org || 'Government of India';
  const category = examData?.category || 'Central Govt';

  const faqs = [
    { question: `What is the eligibility for ${name}?`, answer: `Candidates must have a Bachelor's degree from a recognized university. Age limit varies by post. Check the official notification for detailed eligibility criteria.` },
    { question: `When is ${name} 2025 exam date?`, answer: `The ${name} 2025 exam is expected to be conducted in September-October 2025. Check the official website for confirmed dates.` },
    { question: `How to apply for ${name} 2025?`, answer: `Visit the official website, register, fill in the application form, upload documents, pay the fee, and submit. Keep a printout for reference.` },
    { question: `What is the ${name} exam pattern?`, answer: `The exam typically consists of multiple-choice questions covering General Awareness, Reasoning, Quantitative Aptitude, and English. Check the official notification for the latest pattern.` },
    { question: `What is the salary for ${name} posts?`, answer: `The salary varies by post level, typically ranging from ₹25,500 to ₹1,51,100 under 7th CPC plus DA, HRA, and other allowances.` },
  ];

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600">Exams</Link>
          <span>/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="rounded-2xl bg-gradient-to-r from-secondary-700 to-primary-600 p-8 text-white md:p-12">
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm">{category}</span>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">{name} 2025</h1>
          <p className="mt-2 text-white/80">Complete guide by {org}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/jobs?search=${encodeURIComponent(name)}`} className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-gray-100">
              View Latest Notifications
            </Link>
            <Link href="/tools/age-calculator" className="rounded-lg border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">
              Check Age Eligibility
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">About {name}</h2>
              <p className="mt-3 text-gray-700">
                {name} is conducted by {org} for recruitment to various government positions.
                It is one of the most popular government examinations in India, attracting lakhs of
                candidates every year. The exam provides opportunities for graduates to join prestigious
                government departments with attractive salary packages and job security.
              </p>
            </div>

            {/* Eligibility */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Eligibility Criteria</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Educational Qualification</h3>
                  <p className="mt-1 text-gray-600">Bachelor&apos;s Degree from a recognized University or equivalent.</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Age Limit</h3>
                  <p className="mt-1 text-gray-600">18-32 years (varies by post). Relaxation: OBC +3, SC/ST +5, PwD +10 years.</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-700">Nationality</h3>
                  <p className="mt-1 text-gray-600">Must be a citizen of India.</p>
                </div>
              </div>
            </div>

            {/* Exam Pattern */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Exam Pattern</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Section</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Questions</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Marks</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { section: 'General Intelligence & Reasoning', questions: 25, marks: 50, time: '15 min' },
                      { section: 'General Awareness', questions: 25, marks: 50, time: '15 min' },
                      { section: 'Quantitative Aptitude', questions: 25, marks: 50, time: '15 min' },
                      { section: 'English Comprehension', questions: 25, marks: 50, time: '15 min' },
                    ].map((row) => (
                      <tr key={row.section} className="border-b">
                        <td className="px-4 py-3 text-gray-900">{row.section}</td>
                        <td className="px-4 py-3 text-center">{row.questions}</td>
                        <td className="px-4 py-3 text-center font-semibold">{row.marks}</td>
                        <td className="px-4 py-3 text-center">{row.time}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary-50 font-semibold">
                      <td className="px-4 py-3 text-primary-800">Total</td>
                      <td className="px-4 py-3 text-center text-primary-800">100</td>
                      <td className="px-4 py-3 text-center text-primary-800">200</td>
                      <td className="px-4 py-3 text-center text-primary-800">60 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Syllabus */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Syllabus Overview</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { subject: 'Reasoning', topics: 'Analogies, Classification, Coding-Decoding, Puzzles, Series, Blood Relations, Directions' },
                  { subject: 'General Awareness', topics: 'Current Affairs, History, Geography, Polity, Economy, Science, Environment' },
                  { subject: 'Quantitative Aptitude', topics: 'Number System, Algebra, Geometry, Trigonometry, Statistics, Data Interpretation' },
                  { subject: 'English', topics: 'Reading Comprehension, Grammar, Vocabulary, Error Detection, Sentence Improvement' },
                ].map((item) => (
                  <div key={item.subject} className="rounded-lg border p-4">
                    <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.topics}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Tips */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Preparation Tips</h2>
              <ul className="mt-4 space-y-3">
                {[
                  'Start with understanding the complete syllabus and exam pattern',
                  'Create a study timetable covering all subjects equally',
                  'Practice previous year question papers regularly',
                  'Take mock tests to improve time management',
                  'Focus on current affairs - read newspapers daily',
                  'Revise regularly and make concise notes',
                  'Join a test series for real exam simulation',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <div className="mt-4 space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900">Quick Info</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  { label: 'Conducting Body', value: org },
                  { label: 'Exam Level', value: 'National' },
                  { label: 'Mode', value: 'Computer Based (Online)' },
                  { label: 'Frequency', value: 'Once a year' },
                  { label: 'Category', value: category },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900">Useful Tools</h3>
              <div className="mt-3 space-y-2">
                <Link href="/tools/age-calculator" className="block rounded-lg border p-3 text-sm transition hover:bg-gray-50">
                  Age Calculator
                </Link>
                <Link href="/tools/salary-calculator" className="block rounded-lg border p-3 text-sm transition hover:bg-gray-50">
                  Salary Calculator
                </Link>
                <Link href="/calendar" className="block rounded-lg border p-3 text-sm transition hover:bg-gray-50">
                  Exam Calendar
                </Link>
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900">Related Exams</h3>
              <div className="mt-3 space-y-2">
                {MAJOR_EXAMS.filter((e) => e.slug !== exam && e.category === category).slice(0, 5).map((e) => (
                  <Link key={e.slug} href={`/exam/${e.slug}`} className="block rounded-lg border p-3 text-sm transition hover:bg-gray-50">
                    <p className="font-medium text-gray-900">{e.name}</p>
                    <p className="text-xs text-gray-500">{e.org}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
