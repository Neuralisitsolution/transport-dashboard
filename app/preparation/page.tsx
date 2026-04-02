import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Government Exam Preparation - Study Material, Syllabus & Tips',
  'Free study material for government exam preparation. Get syllabus, recommended books, previous year papers, online resources, and expert tips for SSC, UPSC, Banking, Railway, and Defence exams.',
  '/preparation'
);

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Preparation', url: '/preparation' },
];

interface ExamCategory {
  name: string;
  slug: string;
  description: string;
  exams: string[];
  books: { title: string; author: string }[];
  syllabusTopics: string[];
  previousPapersUrl: string;
  onlineResources: { name: string; url: string }[];
}

const EXAM_CATEGORIES: ExamCategory[] = [
  {
    name: 'SSC Exams',
    slug: 'ssc',
    description:
      'Staff Selection Commission conducts CGL, CHSL, MTS, GD Constable, Stenographer, and other exams for Central Government posts.',
    exams: ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD Constable', 'SSC Stenographer', 'SSC CPO'],
    books: [
      { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal' },
      { title: 'Word Power Made Easy', author: 'Norman Lewis' },
      { title: 'Lucent General Knowledge', author: 'Lucent Publications' },
      { title: 'A Modern Approach to Reasoning', author: 'R.S. Aggarwal' },
    ],
    syllabusTopics: [
      'General Intelligence & Reasoning',
      'General Awareness / GK',
      'Quantitative Aptitude',
      'English Language & Comprehension',
    ],
    previousPapersUrl: 'https://ssc.nic.in',
    onlineResources: [
      { name: 'SSC Official Website', url: 'https://ssc.nic.in' },
      { name: 'SSC Answer Keys', url: 'https://ssc.nic.in' },
    ],
  },
  {
    name: 'UPSC Exams',
    slug: 'upsc',
    description:
      'Union Public Service Commission conducts Civil Services (IAS/IPS/IFS), CDS, NDA, CAPF, and other prestigious exams.',
    exams: ['UPSC CSE (IAS)', 'CDS', 'NDA', 'CAPF', 'IES/ISS', 'UPSC EPFO'],
    books: [
      { title: 'Indian Polity', author: 'M. Laxmikanth' },
      { title: 'India After Gandhi', author: 'Ramachandra Guha' },
      { title: 'Indian Economy', author: 'Ramesh Singh' },
      { title: 'Certificate Physical and Human Geography', author: 'G.C. Leong' },
    ],
    syllabusTopics: [
      'Indian History & Culture',
      'Indian & World Geography',
      'Indian Polity & Governance',
      'Economy & Social Development',
      'General Science & Environment',
      'Current Affairs',
    ],
    previousPapersUrl: 'https://upsc.gov.in',
    onlineResources: [
      { name: 'UPSC Official Website', url: 'https://upsc.gov.in' },
      { name: 'PRS Legislative Research', url: 'https://prsindia.org' },
    ],
  },
  {
    name: 'Banking Exams',
    slug: 'banking',
    description:
      'IBPS, SBI, and RBI conduct exams for Probationary Officers, Clerks, Specialist Officers, and Grade B officers.',
    exams: ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B', 'RBI Assistant'],
    books: [
      { title: 'Quantitative Aptitude', author: 'Arun Sharma' },
      { title: 'A New Approach to Reasoning', author: 'B.S. Sijwali' },
      { title: 'Objective General English', author: 'S.P. Bakshi' },
      { title: 'Banking Awareness', author: 'Arihant Publications' },
    ],
    syllabusTopics: [
      'Quantitative Aptitude',
      'Reasoning Ability & Computer Aptitude',
      'English Language',
      'General / Financial Awareness',
      'Data Analysis & Interpretation',
    ],
    previousPapersUrl: 'https://ibps.in',
    onlineResources: [
      { name: 'IBPS Official Website', url: 'https://ibps.in' },
      { name: 'SBI Careers', url: 'https://sbi.co.in/careers' },
    ],
  },
  {
    name: 'Railway Exams',
    slug: 'railway',
    description:
      'Railway Recruitment Boards conduct NTPC, Group D, ALP, JE, and Paramedical exams for Indian Railways.',
    exams: ['RRB NTPC', 'RRB Group D', 'RRB ALP', 'RRB JE', 'RRB Paramedical'],
    books: [
      { title: 'General Science for Competitive Exams', author: 'Lucent Publications' },
      { title: 'Mathematics for Competitive Exams', author: 'R.D. Sharma' },
      { title: 'Objective General Knowledge', author: 'Lucent Publications' },
      { title: 'Reasoning & Aptitude', author: 'R.S. Aggarwal' },
    ],
    syllabusTopics: [
      'General Awareness',
      'Mathematics',
      'General Intelligence & Reasoning',
      'General Science',
    ],
    previousPapersUrl: 'https://rrbcdg.gov.in',
    onlineResources: [
      { name: 'RRB Official Website', url: 'https://rrbcdg.gov.in' },
      { name: 'Indian Railways', url: 'https://indianrailways.gov.in' },
    ],
  },
  {
    name: 'Defence Exams',
    slug: 'defence',
    description:
      'Defence exams include NDA, CDS, AFCAT, Agniveer for Indian Army, Navy, and Air Force recruitment.',
    exams: ['NDA', 'CDS', 'AFCAT', 'Agniveer (Army)', 'Agniveer (Navy)', 'Agniveer (Air Force)'],
    books: [
      { title: 'Pathfinder NDA/NA', author: 'Arihant Publications' },
      { title: 'CDS Entrance Exam Guide', author: 'R. Gupta' },
      { title: 'Mathematics for NDA', author: 'R.S. Aggarwal' },
      { title: 'English Grammar & Composition', author: 'Wren & Martin' },
    ],
    syllabusTopics: [
      'Mathematics',
      'General Ability (English, GK, Science)',
      'Current Affairs & Defence Awareness',
      'Physical Fitness (for SSB)',
    ],
    previousPapersUrl: 'https://upsc.gov.in',
    onlineResources: [
      { name: 'Join Indian Army', url: 'https://joinindianarmy.nic.in' },
      { name: 'Indian Navy Careers', url: 'https://joinindiannavy.gov.in' },
    ],
  },
  {
    name: 'Teaching Exams',
    slug: 'teaching',
    description:
      'Teaching exams include CTET, State TETs, KVS, NVS, and DSSSB for government teaching posts across India.',
    exams: ['CTET', 'KVS Teacher', 'NVS Teacher', 'DSSSB Teacher', 'State TET'],
    books: [
      { title: 'Child Development & Pedagogy', author: 'Arihant Publications' },
      { title: 'CTET & TETs Previous Year Papers', author: 'Disha Publications' },
      { title: 'Environmental Studies for CTET', author: 'Arihant' },
      { title: 'NCERT Textbooks (Class 1-8)', author: 'NCERT' },
    ],
    syllabusTopics: [
      'Child Development & Pedagogy',
      'Language I & II',
      'Mathematics',
      'Environmental Studies / Science',
      'Social Studies (Paper II)',
    ],
    previousPapersUrl: 'https://ctet.nic.in',
    onlineResources: [
      { name: 'CTET Official Website', url: 'https://ctet.nic.in' },
      { name: 'KVS Official Website', url: 'https://kvsangathan.nic.in' },
    ],
  },
];

const PREPARATION_TIPS = [
  {
    title: 'Know the Syllabus First',
    description:
      'Before starting preparation, thoroughly understand the complete syllabus and exam pattern. Make a list of all topics and prioritize based on weightage.',
  },
  {
    title: 'Create a Realistic Timetable',
    description:
      'Divide your day into focused study blocks. Allocate more time to weaker subjects. Include breaks and revision slots in your schedule.',
  },
  {
    title: 'NCERT Books are Foundation',
    description:
      'For most government exams, NCERT textbooks (Class 6-12) form the foundation. Complete NCERTs before moving to advanced reference books.',
  },
  {
    title: 'Daily Current Affairs',
    description:
      'Read a quality newspaper daily. Make short notes on important events. Current affairs carry significant weightage in most government exams.',
  },
  {
    title: 'Practice Previous Year Papers',
    description:
      'Solving previous year papers helps you understand the exam pattern, difficulty level, and frequently asked topics. Aim to solve at least 10 years of papers.',
  },
  {
    title: 'Take Regular Mock Tests',
    description:
      'Start taking full-length mock tests at least 2 months before the exam. Analyze each mock test thoroughly and work on your weak areas.',
  },
  {
    title: 'Revision is Key',
    description:
      'Regular revision is more important than covering new topics. Revise your notes every week and do a complete revision before the exam.',
  },
  {
    title: 'Stay Healthy and Positive',
    description:
      'Government exam preparation is a marathon, not a sprint. Maintain a healthy lifestyle with proper sleep, exercise, and a balanced diet.',
  },
];

export default function PreparationPage() {
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
            Government Exam Preparation Hub
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Free study material, recommended books, syllabus details, previous year papers, and
            expert preparation tips for all major government exams.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="section-title">Choose Your Exam Category</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {EXAM_CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="card text-center transition hover:border-primary-300 hover:shadow-md"
            >
              <h3 className="font-bold text-gray-900">{cat.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{cat.exams.length} exams</p>
            </a>
          ))}
        </div>
      </section>

      {/* Exam Category Sections */}
      {EXAM_CATEGORIES.map((category) => (
        <section key={category.slug} id={category.slug} className="border-t bg-gray-50 py-12 even:bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="section-title">{category.name} Preparation</h2>
            <p className="mt-2 text-gray-600">{category.description}</p>

            {/* Exams covered */}
            <div className="mt-4 flex flex-wrap gap-2">
              {category.exams.map((exam) => (
                <span
                  key={exam}
                  className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                >
                  {exam}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Syllabus */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900">Syllabus Overview</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {category.syllabusTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={category.previousPapersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline"
                >
                  View detailed syllabus on official website
                </a>
              </div>

              {/* Recommended Books */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900">Recommended Books</h3>
                <ul className="mt-3 space-y-3 text-sm text-gray-600">
                  {category.books.map((book) => (
                    <li key={book.title} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-green-500" />
                      <span>
                        <strong>{book.title}</strong> by {book.author}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Previous Year Papers */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900">Previous Year Papers</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Solving previous year question papers is one of the most effective preparation
                  strategies. It helps you understand the exam pattern, question types, and difficulty
                  level.
                </p>
                <a
                  href={category.previousPapersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-4 inline-flex items-center gap-1 px-4 py-2 text-sm"
                >
                  <svg
                    className="h-4 w-4"
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
                  Download Previous Papers
                </a>
              </div>

              {/* Online Resources */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900">Online Resources</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {category.onlineResources.map((resource) => (
                    <li key={resource.name}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Preparation Tips */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">Expert Preparation Tips</h2>
          <p className="mt-2 text-gray-600">
            Follow these proven strategies to maximize your chances of success in government exams.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PREPARATION_TIPS.map((tip, index) => (
              <div key={tip.title} className="card">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {index + 1}
                </div>
                <h3 className="mt-3 font-bold text-gray-900">{tip.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">Related Resources</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/tools/salary-calculator" className="card group text-center">
            <div className="text-3xl">💰</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Salary Calculator</h3>
            <p className="mt-1 text-sm text-gray-600">7th CPC salary calculator</p>
          </Link>
          <Link href="/tools/age-calculator" className="card group text-center">
            <div className="text-3xl">📅</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Age Calculator</h3>
            <p className="mt-1 text-sm text-gray-600">Check age eligibility</p>
          </Link>
          <Link href="/calendar" className="card group text-center">
            <div className="text-3xl">🗓️</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Exam Calendar</h3>
            <p className="mt-1 text-sm text-gray-600">Upcoming exam dates</p>
          </Link>
          <Link href="/admit-cards" className="card group text-center">
            <div className="text-3xl">🎫</div>
            <h3 className="mt-2 font-bold text-gray-900 group-hover:text-primary-600">Admit Cards</h3>
            <p className="mt-1 text-sm text-gray-600">Download hall tickets</p>
          </Link>
        </div>
      </section>
    </>
  );
}
