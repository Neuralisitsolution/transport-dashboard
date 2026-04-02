'use client';

import { useState } from 'react';
import { JOB_CATEGORIES, EDUCATION_LEVELS, INDIAN_STATES, RESERVATION_CATEGORIES } from '@/lib/constants';

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

interface JobFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function update(key: keyof Filters, value: string) {
    onFilterChange({ ...filters, [key]: value });
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-600 hover:underline md:hidden"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`mt-4 space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">State</label>
          <select
            value={filters.state}
            onChange={(e) => update('state', e.target.value)}
            className="input-field"
          >
            <option value="">All States</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Education</label>
          <select
            value={filters.education}
            onChange={(e) => update('education', e.target.value)}
            className="input-field"
          >
            <option value="">All Levels</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Age Range</label>
          <select
            value={filters.ageRange}
            onChange={(e) => update('ageRange', e.target.value)}
            className="input-field"
          >
            <option value="">Any Age</option>
            <option value="18-20">18-20 years</option>
            <option value="21-25">21-25 years</option>
            <option value="26-30">26-30 years</option>
            <option value="31-35">31-35 years</option>
            <option value="36-45">36-45 years</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Reservation</label>
          <select
            value={filters.reservation}
            onChange={(e) => update('reservation', e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {RESERVATION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Application Fee</label>
          <select
            value={filters.feeType}
            onChange={(e) => update('feeType', e.target.value)}
            className="input-field"
          >
            <option value="">Any</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Minimum Vacancies</label>
          <select
            value={filters.vacancyMin}
            onChange={(e) => update('vacancyMin', e.target.value)}
            className="input-field"
          >
            <option value="">Any</option>
            <option value="10">10+</option>
            <option value="100">100+</option>
            <option value="1000">1000+</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => update('sortBy', e.target.value)}
            className="input-field"
          >
            <option value="latest">Latest First</option>
            <option value="deadline">Deadline Soon</option>
            <option value="vacancies">Most Vacancies</option>
          </select>
        </div>

        <button
          onClick={() =>
            onFilterChange({
              category: '', state: '', education: '', ageRange: '',
              reservation: '', feeType: '', vacancyMin: '', sortBy: 'latest',
            })
          }
          className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
