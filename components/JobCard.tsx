import Link from 'next/link';
import { formatIndianNumber, formatDate, daysUntil, getCategoryColor, getVacancyBadgeColor } from '@/lib/constants';
import CountdownTimer from './CountdownTimer';

interface JobCardProps {
  job: {
    title: string;
    slug: string;
    organization: string;
    category: string;
    subCategory: string;
    totalVacancies: number;
    eligibility: {
      education: string;
      age: { min: number; max: number };
    };
    salary: {
      minSalary: number;
      maxSalary: number;
      inHandEstimate: number;
    };
    importantDates: {
      applicationEnd: string;
      applicationStart: string;
    };
    location: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const days = daysUntil(job.importantDates.applicationEnd);
  const isNew = daysUntil(job.createdAt) >= -1;
  const isUrgent = days >= 0 && days <= 7;

  return (
    <div className="card group relative overflow-hidden">
      {job.isFeatured && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
          Featured
        </div>
      )}
      {isNew && !job.isFeatured && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white">
          New
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-500">
          {job.organization.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <Link href={`/jobs/${job.slug}`} className="group-hover:text-primary-600">
            <h3 className="font-semibold text-gray-900 transition group-hover:text-primary-600">
              {job.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-gray-600">{job.organization}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`badge ${getCategoryColor(job.category)}`}>
              {job.category}
            </span>
            {job.subCategory && (
              <span className="badge bg-gray-100 text-gray-700">{job.subCategory}</span>
            )}
            <span className={`badge ${getVacancyBadgeColor(job.totalVacancies)}`}>
              {formatIndianNumber(job.totalVacancies)} Vacancies
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 sm:grid-cols-4">
            <div>
              <span className="block font-medium text-gray-400">Education</span>
              <span className="text-gray-700">{job.eligibility.education || 'Various'}</span>
            </div>
            <div>
              <span className="block font-medium text-gray-400">Age</span>
              <span className="text-gray-700">{job.eligibility.age.min}-{job.eligibility.age.max} years</span>
            </div>
            <div>
              <span className="block font-medium text-gray-400">Salary</span>
              <span className="text-gray-700">
                {job.salary.inHandEstimate > 0
                  ? `₹${formatIndianNumber(job.salary.inHandEstimate)}/mo`
                  : job.salary.minSalary > 0
                  ? `₹${formatIndianNumber(job.salary.minSalary)}-${formatIndianNumber(job.salary.maxSalary)}`
                  : 'As per rules'}
              </span>
            </div>
            <div>
              <span className="block font-medium text-gray-400">Location</span>
              <span className="text-gray-700">{job.location}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div className="text-sm">
              {isUrgent && days >= 0 ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <CountdownTimer targetDate={job.importantDates.applicationEnd} />
                </div>
              ) : job.importantDates.applicationEnd ? (
                <span className="text-gray-500">
                  Last Date: <span className="font-medium text-gray-700">{formatDate(job.importantDates.applicationEnd)}</span>
                </span>
              ) : (
                <span className="text-gray-400">Date not announced</span>
              )}
            </div>

            <Link
              href={`/jobs/${job.slug}`}
              className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
            >
              View & Apply
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
