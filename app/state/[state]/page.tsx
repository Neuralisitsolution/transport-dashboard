import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo-helpers';
import {
  INDIAN_STATES,
  STATE_COMMISSIONS,
  getStateSlug,
  formatIndianNumber,
} from '@/lib/constants';

const STATE_META: Record<
  string,
  {
    activeJobs: number;
    totalVacancies: number;
    avgSalary: string;
    description: string;
  }
> = {
  'Telangana': {
    activeJobs: 87,
    totalVacancies: 14320,
    avgSalary: '25,500 - 67,700',
    description:
      'Telangana state government jobs are recruited through TSPSC (Telangana State Public Service Commission), TSGENCO, TSRTC, and other state departments. Major exams include Group 1, Group 2, Group 3, and Group 4 services.',
  },
  'Andhra Pradesh': {
    activeJobs: 64,
    totalVacancies: 11540,
    avgSalary: '22,000 - 63,200',
    description:
      'Andhra Pradesh government jobs are conducted by APPSC (Andhra Pradesh Public Service Commission), APGENCO, APSRTC, and various state departments. Group 1, Group 2, and VRO/VRA are the most popular exams.',
  },
  'Maharashtra': {
    activeJobs: 156,
    totalVacancies: 34780,
    avgSalary: '25,500 - 78,800',
    description:
      'Maharashtra government recruitment is managed by MPSC, Mahavitaran, MSRTC, and other state organizations. The MPSC exam for state civil services is one of the most competitive in India.',
  },
  'Karnataka': {
    activeJobs: 98,
    totalVacancies: 18920,
    avgSalary: '23,000 - 67,700',
    description:
      'Karnataka Public Service Commission (KPSC) conducts FDA, SDA, Group A and Group B exams. KPTCL and KSP also recruit regularly for technical and police positions.',
  },
  'Uttar Pradesh': {
    activeJobs: 234,
    totalVacancies: 56340,
    avgSalary: '21,700 - 56,900',
    description:
      'Uttar Pradesh has the largest state government recruitment with UPPSC conducting PCS exams, UPSSSC for Group C posts, and UP Police for constable and SI recruitment.',
  },
  'Tamil Nadu': {
    activeJobs: 112,
    totalVacancies: 22450,
    avgSalary: '25,500 - 69,100',
    description:
      'TNPSC conducts Group 1, Group 2, Group 4, and VAO exams for Tamil Nadu government jobs. TANGEDCO and TNEB recruit for the power sector.',
  },
  'Rajasthan': {
    activeJobs: 145,
    totalVacancies: 28700,
    avgSalary: '21,700 - 63,200',
    description:
      'RPSC conducts RAS/RTS exams for administrative services while RSMSSB handles Group D and other subordinate service recruitments in Rajasthan.',
  },
  'Bihar': {
    activeJobs: 78,
    totalVacancies: 15600,
    avgSalary: '18,000 - 56,900',
    description:
      'Bihar Public Service Commission (BPSC) conducts Combined Competitive Examinations (CCE) for state civil services. BSSC handles junior-level recruitments.',
  },
  'West Bengal': {
    activeJobs: 92,
    totalVacancies: 19800,
    avgSalary: '22,000 - 63,200',
    description:
      'WBPSC conducts civil service exams and WBSSC handles school service commission examinations. West Bengal has a large number of teaching and clerical positions.',
  },
  'Gujarat': {
    activeJobs: 105,
    totalVacancies: 21340,
    avgSalary: '25,500 - 69,100',
    description:
      'GPSC conducts Class 1, 2, and 3 exams while GSSSB handles clerical and subordinate service recruitment in Gujarat.',
  },
  'Madhya Pradesh': {
    activeJobs: 134,
    totalVacancies: 26500,
    avgSalary: '21,700 - 56,900',
    description:
      'MPPSC conducts State Service Examinations while MPESB (Vyapam) handles Group 2 to Group 5 level recruitments across Madhya Pradesh.',
  },
  'Kerala': {
    activeJobs: 88,
    totalVacancies: 16400,
    avgSalary: '26,500 - 69,100',
    description:
      'Kerala PSC is one of the most active state commissions, conducting exams for administrative, police, teaching, and health department positions throughout the year.',
  },
};

const SAMPLE_STATE_JOBS: Record<
  string,
  { title: string; org: string; vacancies: number; lastDate: string; slug: string; education: string }[]
> = {
  'Telangana': [
    { title: 'TSPSC Group 1 Services 2025', org: 'Telangana PSC', vacancies: 563, lastDate: '2025-07-10', slug: 'tspsc-group-1-2025', education: 'Graduate' },
    { title: 'TSPSC Group 2 Recruitment 2025', org: 'Telangana PSC', vacancies: 1392, lastDate: '2025-08-20', slug: 'tspsc-group-2-2025', education: 'Graduate' },
    { title: 'TSGENCO AE Recruitment 2025', org: 'TSGENCO', vacancies: 412, lastDate: '2025-07-25', slug: 'tsgenco-ae-2025', education: 'B.Tech / B.E.' },
    { title: 'TS Police Constable 2025', org: 'Telangana Police', vacancies: 16924, lastDate: '2025-09-01', slug: 'ts-police-constable-2025', education: '10th Pass' },
    { title: 'TSSPDCL JLM Recruitment 2025', org: 'TSSPDCL', vacancies: 2500, lastDate: '2025-08-15', slug: 'tsspdcl-jlm-2025', education: 'ITI / 10th Pass' },
  ],
  'Uttar Pradesh': [
    { title: 'UPPSC PCS 2025 - Combined State Services', org: 'UP PSC', vacancies: 1240, lastDate: '2025-08-05', slug: 'uppsc-pcs-2025', education: 'Graduate' },
    { title: 'UPSSSC PET 2025', org: 'UPSSSC', vacancies: 8500, lastDate: '2025-07-30', slug: 'upsssc-pet-2025', education: '10th / 12th Pass' },
    { title: 'UP Police Constable 2025', org: 'UP Police', vacancies: 60244, lastDate: '2025-09-15', slug: 'up-police-constable-2025', education: '12th Pass' },
    { title: 'UP TET 2025', org: 'UP Basic Education Board', vacancies: 0, lastDate: '2025-07-15', slug: 'up-tet-2025', education: 'Graduate / B.Ed' },
    { title: 'UPPSC RO/ARO 2025', org: 'UP PSC', vacancies: 411, lastDate: '2025-08-25', slug: 'uppsc-ro-aro-2025', education: 'Graduate' },
  ],
  'Maharashtra': [
    { title: 'MPSC State Service Exam 2025', org: 'Maharashtra PSC', vacancies: 431, lastDate: '2025-07-20', slug: 'mpsc-state-service-2025', education: 'Graduate' },
    { title: 'Maharashtra Police Constable 2025', org: 'Maharashtra Police', vacancies: 17471, lastDate: '2025-06-25', slug: 'maha-police-2025', education: '12th Pass' },
    { title: 'MPSC Engineering Services 2025', org: 'Maharashtra PSC', vacancies: 860, lastDate: '2025-08-10', slug: 'mpsc-engineering-2025', education: 'B.Tech / B.E.' },
    { title: 'Mahavitaran Technician 2025', org: 'Mahavitaran (MSEDCL)', vacancies: 3450, lastDate: '2025-09-05', slug: 'mahavitaran-tech-2025', education: 'ITI / Diploma' },
    { title: 'MSRTC Driver Conductor 2025', org: 'MSRTC', vacancies: 7200, lastDate: '2025-08-30', slug: 'msrtc-driver-2025', education: '10th Pass' },
  ],
};

const EXAM_CALENDAR: Record<
  string,
  { exam: string; tentativeDate: string; status: string }[]
> = {
  'Telangana': [
    { exam: 'TSPSC Group 1 Prelims', tentativeDate: 'June 2025', status: 'Notification Out' },
    { exam: 'TSPSC Group 2 Prelims', tentativeDate: 'August 2025', status: 'Application Open' },
    { exam: 'TSPSC Group 3 (Panchayat Secretary)', tentativeDate: 'October 2025', status: 'Expected' },
    { exam: 'TSPSC Group 4', tentativeDate: 'December 2025', status: 'Expected' },
    { exam: 'TS Police SI Exam', tentativeDate: 'September 2025', status: 'Notification Expected' },
  ],
  'Uttar Pradesh': [
    { exam: 'UPPSC PCS Prelims', tentativeDate: 'June 2025', status: 'Notification Out' },
    { exam: 'UPSSSC PET', tentativeDate: 'August 2025', status: 'Application Open' },
    { exam: 'UP Police Constable Written', tentativeDate: 'October 2025', status: 'Expected' },
    { exam: 'UPPSC RO/ARO Prelims', tentativeDate: 'September 2025', status: 'Notification Out' },
    { exam: 'UPPSC BEO Exam', tentativeDate: 'November 2025', status: 'Expected' },
  ],
  'Maharashtra': [
    { exam: 'MPSC State Service Prelims', tentativeDate: 'July 2025', status: 'Notification Out' },
    { exam: 'MPSC Engineering Services', tentativeDate: 'September 2025', status: 'Application Open' },
    { exam: 'Maharashtra Police Constable', tentativeDate: 'August 2025', status: 'Admit Card Expected' },
    { exam: 'MPSC Subordinate Services', tentativeDate: 'November 2025', status: 'Expected' },
    { exam: 'Talathi Bharti 2025', tentativeDate: 'October 2025', status: 'Expected' },
  ],
};

function getStateName(slug: string): string | null {
  for (const state of INDIAN_STATES) {
    if (getStateSlug(state) === slug) {
      return state;
    }
  }
  return null;
}

function getDefaultMeta(stateName: string) {
  return {
    activeJobs: 45,
    totalVacancies: 8500,
    avgSalary: '21,700 - 56,900',
    description: `${stateName} government jobs are recruited through the state public service commission and various state departments. Stay updated with the latest sarkari naukri notifications.`,
  };
}

function getDefaultJobs(stateName: string) {
  const commissions = STATE_COMMISSIONS[stateName] || [];
  const mainOrg = commissions[0] || `${stateName} Govt`;
  return [
    {
      title: `${mainOrg} Recruitment 2025`,
      org: mainOrg,
      vacancies: 350,
      lastDate: '2025-08-15',
      slug: `${getStateSlug(stateName)}-psc-2025`,
      education: 'Graduate',
    },
    {
      title: `${stateName} Police Constable 2025`,
      org: `${stateName} Police`,
      vacancies: 5200,
      lastDate: '2025-09-10',
      slug: `${getStateSlug(stateName)}-police-2025`,
      education: '10th / 12th Pass',
    },
    {
      title: `${stateName} Teacher Recruitment 2025`,
      org: `${stateName} Education Dept`,
      vacancies: 1800,
      lastDate: '2025-10-01',
      slug: `${getStateSlug(stateName)}-teacher-2025`,
      education: 'Graduate / B.Ed',
    },
  ];
}

function getDefaultCalendar(stateName: string) {
  const commissions = STATE_COMMISSIONS[stateName] || [];
  const mainOrg = commissions[0] || `${stateName} PSC`;
  return [
    { exam: `${mainOrg} Combined Exam`, tentativeDate: 'August 2025', status: 'Expected' },
    { exam: `${stateName} Police Recruitment`, tentativeDate: 'October 2025', status: 'Expected' },
    { exam: `${stateName} TET`, tentativeDate: 'December 2025', status: 'Expected' },
  ];
}

type Props = {
  params: Promise<{ state: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const stateName = getStateName(slug);
  if (!stateName) return {};
  const meta = STATE_META[stateName] || getDefaultMeta(stateName);
  return generatePageMetadata(
    `${stateName} Government Jobs 2025`,
    `Browse ${formatIndianNumber(meta.totalVacancies)}+ government job vacancies in ${stateName}. ${stateName} PSC, police, teaching and other state govt jobs. Apply online for latest sarkari naukri.`,
    `/state/${slug}`
  );
}

export default async function StatePage({ params }: Props) {
  const { state: slug } = await params;
  const stateName = getStateName(slug);

  if (!stateName) {
    notFound();
  }

  const meta = STATE_META[stateName] || getDefaultMeta(stateName);
  const commissions = STATE_COMMISSIONS[stateName] || [];
  const jobs = SAMPLE_STATE_JOBS[stateName] || getDefaultJobs(stateName);
  const calendar = EXAM_CALENDAR[stateName] || getDefaultCalendar(stateName);

  return (
    <>
      {/* State Header */}
      <section className="bg-gradient-to-br from-purple-500 to-purple-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/category/state-govt" className="hover:text-white">State Govt Jobs</Link>
            <span>/</span>
            <span className="font-medium text-white">{stateName}</span>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-extrabold md:text-5xl">
              {stateName} Government Jobs 2025
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/80">
              Latest sarkari naukri notifications from {stateName} state government departments, PSC, police, and other organizations.
            </p>
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-3 gap-4 sm:max-w-xl">
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-extrabold">{formatIndianNumber(meta.activeJobs)}</p>
              <p className="text-xs text-white/70">Active Jobs</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-extrabold">{formatIndianNumber(meta.totalVacancies)}</p>
              <p className="text-xs text-white/70">Total Vacancies</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-lg font-extrabold">{meta.avgSalary}</p>
              <p className="text-xs text-white/70">Salary Range (INR)</p>
            </div>
          </div>
        </div>
      </section>

      {/* State Commissions */}
      {commissions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="section-title">{stateName} Recruiting Organizations</h2>
          <p className="mt-1 text-gray-600">
            Major commissions and departments that recruit for {stateName} government jobs
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {commissions.map((commission) => (
              <Link
                key={commission}
                href={`/jobs?state=${encodeURIComponent(stateName)}&sub=${encodeURIComponent(commission)}`}
                className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-purple-700 shadow-sm">
                  {commission.substring(0, 3)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{commission}</p>
                  <p className="text-xs text-gray-500">View all jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Active State Jobs */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Active {stateName} Jobs</h2>
              <p className="mt-1 text-gray-600">
                Latest government job notifications in {stateName}
              </p>
            </div>
            <Link
              href={`/jobs?state=${encodeURIComponent(stateName)}`}
              className="btn-primary hidden sm:inline-flex"
            >
              View All {stateName} Jobs
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="card group">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-sm font-bold text-purple-700">
                    {job.org.charAt(0)}
                  </div>
                  <span className="badge bg-purple-100 text-purple-800">State Govt</span>
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
              href={`/jobs?state=${encodeURIComponent(stateName)}`}
              className="btn-primary"
            >
              View All {stateName} Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Exam Calendar */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="section-title">{stateName} Exam Calendar 2025</h2>
        <p className="mt-1 text-gray-600">
          Upcoming government exam schedule for {stateName}
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-900">Exam Name</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Tentative Date</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calendar.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.exam}</td>
                  <td className="px-4 py-3 text-gray-600">{item.tentativeDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        item.status === 'Notification Out'
                          ? 'badge-green'
                          : item.status === 'Application Open'
                            ? 'badge-orange'
                            : item.status === 'Admit Card Expected'
                              ? 'badge-blue'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* About This State */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-title">About {stateName} Government Jobs</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-gray-600">
            <p>{meta.description}</p>
            <p>
              NaukriAlert AI tracks all {stateName} government job notifications in real time.
              Our AI engine processes updates from official sources including{' '}
              {commissions.length > 0
                ? commissions.slice(0, 3).join(', ')
                : `${stateName} state departments`}{' '}
              every 2 hours so you never miss an application deadline. Create a free profile to
              receive personalized alerts for {stateName} government jobs matching your
              qualifications.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/profile" className="btn-primary">
              Get Personalized Alerts
            </Link>
            <Link
              href={`/jobs?state=${encodeURIComponent(stateName)}`}
              className="btn-outline"
            >
              Browse All {stateName} Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
