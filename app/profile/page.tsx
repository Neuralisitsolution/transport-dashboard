'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  INDIAN_STATES,
  JOB_CATEGORIES,
  EDUCATION_LEVELS,
  RESERVATION_CATEGORIES,
} from '@/lib/constants';

interface ProfileForm {
  name: string;
  email: string;
  dateOfBirth: string;
  educationLevel: string;
  category: string;
  state: string;
  preferredJobCategories: string[];
  preferredStates: string[];
  minimumSalary: string;
}

const initialForm: ProfileForm = {
  name: '',
  email: '',
  dateOfBirth: '',
  educationLevel: '',
  category: '',
  state: '',
  preferredJobCategories: [],
  preferredStates: [],
  minimumSalary: '',
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stateSearch, setStateSearch] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobCategoryToggle = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      preferredJobCategories: prev.preferredJobCategories.includes(cat)
        ? prev.preferredJobCategories.filter((c) => c !== cat)
        : [...prev.preferredJobCategories, cat],
    }));
  };

  const handlePreferredStateToggle = (state: string) => {
    setForm((prev) => ({
      ...prev,
      preferredStates: prev.preferredStates.includes(state)
        ? prev.preferredStates.filter((s) => s !== state)
        : [...prev.preferredStates, state],
    }));
  };

  const removePreferredState = (state: string) => {
    setForm((prev) => ({
      ...prev,
      preferredStates: prev.preferredStates.filter((s) => s !== state),
    }));
  };

  const filteredStates = INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          minimumSalary: form.minimumSalary ? Number(form.minimumSalary) : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setMessage({ type: 'success', text: 'Profile saved successfully! We will match jobs for you.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Your Profile</h1>
        <p className="mt-2 text-gray-600">
          Fill in your details and our AI will match you with eligible government jobs.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 rounded-lg p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-gray-700">
                Home State
              </label>
              <select
                id="state"
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select your state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Qualification */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Qualification &amp; Category</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="educationLevel" className="mb-1.5 block text-sm font-medium text-gray-700">
                Education Level
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                required
                value={form.educationLevel}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select education level</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
                Reservation Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select category</option>
                {RESERVATION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="minimumSalary" className="mb-1.5 block text-sm font-medium text-gray-700">
                Minimum Salary Expectation (per month in INR)
              </label>
              <input
                id="minimumSalary"
                name="minimumSalary"
                type="number"
                min="0"
                step="1000"
                value={form.minimumSalary}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Preferred Job Categories */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Preferred Job Categories</h2>
          <p className="mb-4 text-sm text-gray-600">Select the categories you are interested in.</p>
          <div className="flex flex-wrap gap-3">
            {JOB_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  form.preferredJobCategories.includes(cat)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.preferredJobCategories.includes(cat)}
                  onChange={() => handleJobCategoryToggle(cat)}
                  className="sr-only"
                />
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    form.preferredJobCategories.includes(cat)
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-400'
                  }`}
                >
                  {form.preferredJobCategories.includes(cat) && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Preferred States (Multi-select) */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Preferred Job Locations</h2>
          <p className="mb-4 text-sm text-gray-600">Select states where you want to work.</p>

          {/* Selected tags */}
          {form.preferredStates.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {form.preferredStates.map((state) => (
                <span
                  key={state}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800"
                >
                  {state}
                  <button
                    type="button"
                    onClick={() => removePreferredState(state)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary-200"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search and dropdown */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search and select states..."
              value={stateSearch}
              onChange={(e) => {
                setStateSearch(e.target.value);
                setShowStateDropdown(true);
              }}
              onFocus={() => setShowStateDropdown(true)}
              className="input-field"
            />
            {showStateDropdown && (
              <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => {
                      handlePreferredStateToggle(state);
                      setStateSearch('');
                      setShowStateDropdown(false);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${
                      form.preferredStates.includes(state) ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    {form.preferredStates.includes(state) && (
                      <svg className="h-4 w-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {state}
                  </button>
                ))}
                {filteredStates.length === 0 && (
                  <p className="px-4 py-2 text-sm text-gray-500">No states found.</p>
                )}
              </div>
            )}
          </div>
          {showStateDropdown && (
            <button
              type="button"
              className="mt-2 text-xs text-gray-500 underline"
              onClick={() => setShowStateDropdown(false)}
            >
              Close dropdown
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancel
          </Link>
        </div>
      </form>

      {/* Matched Jobs Placeholder */}
      <div className="mt-12">
        <h2 className="section-title text-xl">Matched Jobs</h2>
        <div className="mt-4 card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Matched jobs will appear here</h3>
          <p className="mt-2 text-sm text-gray-600">
            Save your profile above and our AI will find government jobs that match your
            eligibility, qualifications, and preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
