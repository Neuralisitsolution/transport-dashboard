'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import SearchBar from '@/components/SearchBar';
import { formatIndianNumber } from '@/lib/constants';

interface Filters {
  category: string;
  state: string;
  education: string;
  ageRange: string;
  reservation: string;
  feeType: string;
  vacancyMin: string;
  sortBy: string;
}

interface Job {
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
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

const DEFAULT_FILTERS: Filters = {
  category: '',
  state: '',
  education: '',
  ageRange: '',
  reservation: '',
  feeType: '',
  vacancyMin: '',
  sortBy: 'latest',
};

const ITEMS_PER_PAGE = 12;

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><div className="h-96 animate-pulse rounded-xl bg-gray-100" /></div>}>
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get('category') || '',
    state: searchParams.get('state') || '',
    education: searchParams.get('education') || '',
    ageRange: searchParams.get('ageRange') || '',
    reservation: searchParams.get('reservation') || '',
    feeType: searchParams.get('feeType') || '',
    vacancyMin: searchParams.get('vacancyMin') || '',
    sortBy: searchParams.get('sortBy') || 'latest',
  });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.state) params.set('state', filters.state);
    if (filters.education) params.set('education', filters.education);
    if (filters.ageRange) params.set('ageRange', filters.ageRange);
    if (filters.reservation) params.set('reservation', filters.reservation);
    if (filters.feeType) params.set('feeType', filters.feeType);
    if (filters.vacancyMin) params.set('vacancyMin', filters.vacancyMin);
    if (filters.sortBy && filters.sortBy !== 'latest') params.set('sortBy', filters.sortBy);
    if (search) params.set('search', search);
    if (page > 1) params.set('page', String(page));
    return params.toString();
  }, [filters, search, page]);

  useEffect(() => {
    const qs = buildQueryString();
    router.replace(`/jobs${qs ? `?${qs}` : ''}`, { scroll: false });

    async function fetchJobs() {
      setLoading(true);
      try {
        const apiParams = new URLSearchParams();
        if (filters.category) apiParams.set('category', filters.category);
        if (filters.state) apiParams.set('state', filters.state);
        if (filters.education) apiParams.set('education', filters.education);
        if (filters.ageRange) apiParams.set('ageRange', filters.ageRange);
        if (filters.reservation) apiParams.set('reservation', filters.reservation);
        if (filters.feeType) apiParams.set('feeType', filters.feeType);
        if (filters.vacancyMin) apiParams.set('vacancyMin', filters.vacancyMin);
        if (filters.sortBy) apiParams.set('sortBy', filters.sortBy);
        if (search) apiParams.set('search', search);
        apiParams.set('page', String(page));
        apiParams.set('limit', String(ITEMS_PER_PAGE));

        const res = await fetch(`/api/jobs?${apiParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data: JobsResponse = await res.json();
        setJobs(data.jobs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        setJobs([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [filters, search, page, buildQueryString, router]);

  function handleFilterChange(newFilters: Filters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="section-title">Government Jobs</h1>
        <p className="mt-2 text-gray-600">
          Browse latest government job openings across India
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar className="max-w-2xl" />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24">
            <JobFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Job Listings */}
        <main className="min-w-0 flex-1">
          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? (
                <span className="inline-block h-4 w-32 animate-pulse rounded bg-gray-200" />
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {total > 0 ? formatIndianNumber((page - 1) * ITEMS_PER_PAGE + 1) : 0}
                    {' '}-{' '}
                    {formatIndianNumber(Math.min(page * ITEMS_PER_PAGE, total))}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900">
                    {formatIndianNumber(total)}
                  </span>{' '}
                  jobs
                </>
              )}
            </p>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200" />
                    <div className="min-w-0 flex-1">
                      <div className="h-5 w-3/4 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
                      <div className="mt-3 flex gap-2">
                        <div className="h-5 w-20 rounded-full bg-gray-200" />
                        <div className="h-5 w-24 rounded-full bg-gray-200" />
                        <div className="h-5 w-28 rounded-full bg-gray-200" />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="h-8 rounded bg-gray-200" />
                        <div className="h-8 rounded bg-gray-200" />
                        <div className="h-8 rounded bg-gray-200" />
                        <div className="h-8 rounded bg-gray-200" />
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <div className="h-4 w-32 rounded bg-gray-200" />
                        <div className="h-8 w-24 rounded-lg bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && jobs.length === 0 && (
            <div className="card flex flex-col items-center py-16 text-center">
              <svg
                className="h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No jobs found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                We could not find any jobs matching your filters. Try adjusting
                your search or clearing the filters.
              </p>
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setSearch('');
                  setPage(1);
                }}
                className="btn-primary mt-6"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Job Cards Grid */}
          {!loading && jobs.length > 0 && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {generatePageNumbers(page, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                      p === page
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}
