'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { JOB_CATEGORIES, INDIAN_STATES, EDUCATION_LEVELS, formatIndianNumber, formatDate } from '@/lib/constants';

interface Job {
  _id: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  totalVacancies: number;
  educationRequired: string;
  ageLimit: string;
  salary: string;
  applicationStart: string;
  applicationEnd: string;
  officialUrl: string;
  slug: string;
  description: string;
  isExpired: boolean;
}

interface Stats {
  totalJobs: number;
  newToday: number;
  expired: number;
  emailSubscribers: number;
  telegramSubscribers: number;
}

const emptyJobForm = {
  title: '',
  organization: '',
  category: '',
  location: '',
  totalVacancies: '',
  educationRequired: '',
  ageLimit: '',
  salary: '',
  applicationStart: '',
  applicationEnd: '',
  officialUrl: '',
  description: '',
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    newToday: 0,
    expired: 0,
    emailSubscribers: 0,
    telegramSubscribers: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<string | null>(null);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password. Try "admin" for demo.');
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes] = await Promise.all([
          fetch('/api/jobs'),
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const jobsList: Job[] = jobsData.jobs || jobsData || [];
          setJobs(jobsList);

          const today = new Date().toISOString().split('T')[0];
          setStats({
            totalJobs: jobsList.length,
            newToday: jobsList.filter(
              (j: Job) => j.applicationStart && j.applicationStart.startsWith(today)
            ).length,
            expired: jobsList.filter((j: Job) => j.isExpired).length,
            emailSubscribers: 0,
            telegramSubscribers: 0,
          });
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to fetch data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticated]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveJob = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      ...jobForm,
      totalVacancies: Number(jobForm.totalVacancies) || 0,
    };

    try {
      const url = editingId ? `/api/jobs/${editingId}` : '/api/jobs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save job');

      setMessage({ type: 'success', text: editingId ? 'Job updated!' : 'Job created!' });
      setJobForm(emptyJobForm);
      setEditingId(null);

      // Refresh jobs
      const refreshRes = await fetch('/api/jobs');
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setJobs(data.jobs || data || []);
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save job. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingId(job._id);
    setJobForm({
      title: job.title,
      organization: job.organization,
      category: job.category,
      location: job.location,
      totalVacancies: String(job.totalVacancies),
      educationRequired: job.educationRequired,
      ageLimit: job.ageLimit,
      salary: job.salary,
      applicationStart: job.applicationStart ? job.applicationStart.split('T')[0] : '',
      applicationEnd: job.applicationEnd ? job.applicationEnd.split('T')[0] : '',
      officialUrl: job.officialUrl,
      description: job.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setJobs((prev) => prev.filter((j) => j._id !== id));
      setMessage({ type: 'success', text: 'Job deleted.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete job.' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setJobForm(emptyJobForm);
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="card w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="input-field mb-4"
            />
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage jobs, subscribers, and platform data.</p>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>

      {/* Fetch Live Jobs */}
      <div className="mb-6 card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Fetch Live Jobs from Sources</h3>
            <p className="text-sm text-gray-600">Scrape sarkariresult.com, freejobalert.com & more. Uses Gemini AI to process data.</p>
          </div>
          <button
            onClick={async () => {
              setFetching(true);
              setFetchResult(null);
              try {
                const res = await fetch('/api/cron/fetch-jobs?manual=true');
                const data = await res.json();
                setFetchResult(`Done! ${data.newJobs || 0} new jobs added, ${data.duplicates || 0} duplicates, ${data.errors || 0} errors.`);
                // Refresh job list
                const refreshRes = await fetch('/api/jobs');
                if (refreshRes.ok) {
                  const d = await refreshRes.json();
                  setJobs(d.jobs || []);
                  setStats(prev => ({ ...prev, totalJobs: (d.jobs || []).length }));
                }
              } catch (err) {
                setFetchResult('Fetch failed: ' + (err as Error).message);
              } finally {
                setFetching(false);
              }
            }}
            disabled={fetching}
            className="btn-primary whitespace-nowrap"
          >
            {fetching ? 'Fetching... (may take 1-2 min)' : 'Fetch Live Jobs Now'}
          </button>
        </div>
        {fetchResult && (
          <div className="mt-3 rounded-lg bg-white p-3 text-sm text-gray-700 border">
            {fetchResult}
          </div>
        )}
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

      {/* Stats Overview */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Jobs', value: stats.totalJobs, color: 'bg-blue-100 text-blue-800' },
          { label: 'New Today', value: stats.newToday, color: 'bg-green-100 text-green-800' },
          { label: 'Expired', value: stats.expired, color: 'bg-red-100 text-red-800' },
          { label: 'Email Subscribers', value: stats.emailSubscribers, color: 'bg-purple-100 text-purple-800' },
          { label: 'Telegram Subscribers', value: stats.telegramSubscribers, color: 'bg-orange-100 text-orange-800' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-2xl font-bold ${stat.color}`}>
              {formatIndianNumber(stat.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Job Entry Form */}
      <div className="card mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {editingId ? 'Edit Job' : 'Add New Job'}
        </h2>
        <form onSubmit={handleSaveJob} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={jobForm.title}
                onChange={handleFormChange}
                placeholder="e.g. SSC CGL 2025"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="organization" className="mb-1.5 block text-sm font-medium text-gray-700">
                Organization
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                required
                value={jobForm.organization}
                onChange={handleFormChange}
                placeholder="e.g. Staff Selection Commission"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={jobForm.category}
                onChange={handleFormChange}
                className="input-field"
              >
                <option value="">Select category</option>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700">
                Location / State
              </label>
              <select
                id="location"
                name="location"
                required
                value={jobForm.location}
                onChange={handleFormChange}
                className="input-field"
              >
                <option value="">Select location</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="totalVacancies" className="mb-1.5 block text-sm font-medium text-gray-700">
                Total Vacancies
              </label>
              <input
                id="totalVacancies"
                name="totalVacancies"
                type="number"
                min="0"
                required
                value={jobForm.totalVacancies}
                onChange={handleFormChange}
                placeholder="e.g. 17727"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="educationRequired" className="mb-1.5 block text-sm font-medium text-gray-700">
                Education Required
              </label>
              <select
                id="educationRequired"
                name="educationRequired"
                required
                value={jobForm.educationRequired}
                onChange={handleFormChange}
                className="input-field"
              >
                <option value="">Select education</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ageLimit" className="mb-1.5 block text-sm font-medium text-gray-700">
                Age Limit
              </label>
              <input
                id="ageLimit"
                name="ageLimit"
                type="text"
                value={jobForm.ageLimit}
                onChange={handleFormChange}
                placeholder="e.g. 18-32 years"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="salary" className="mb-1.5 block text-sm font-medium text-gray-700">
                Salary / Pay Scale
              </label>
              <input
                id="salary"
                name="salary"
                type="text"
                value={jobForm.salary}
                onChange={handleFormChange}
                placeholder="e.g. Rs. 25,500 - 81,100"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="applicationStart" className="mb-1.5 block text-sm font-medium text-gray-700">
                Application Start Date
              </label>
              <input
                id="applicationStart"
                name="applicationStart"
                type="date"
                value={jobForm.applicationStart}
                onChange={handleFormChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="applicationEnd" className="mb-1.5 block text-sm font-medium text-gray-700">
                Application End Date
              </label>
              <input
                id="applicationEnd"
                name="applicationEnd"
                type="date"
                required
                value={jobForm.applicationEnd}
                onChange={handleFormChange}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="officialUrl" className="mb-1.5 block text-sm font-medium text-gray-700">
                Official URL
              </label>
              <input
                id="officialUrl"
                name="officialUrl"
                type="url"
                value={jobForm.officialUrl}
                onChange={handleFormChange}
                placeholder="https://..."
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={jobForm.description}
                onChange={handleFormChange}
                placeholder="Job description, eligibility details, etc."
                className="input-field"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingId ? 'Update Job' : 'Add Job'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-outline">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Jobs Table */}
      <div className="card overflow-hidden p-0">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-bold text-gray-900">All Jobs ({jobs.length})</h2>
        </div>

        {loading ? (
          <div className="p-6 pt-0 text-center text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-6 pt-0 text-center text-gray-500">No jobs found. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-t border-b bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Organization</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Vacancies</th>
                  <th className="px-6 py-3">Last Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      <Link href={`/jobs/${job.slug}`} className="hover:text-primary-600">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{job.organization}</td>
                    <td className="px-6 py-3">
                      <span className="badge-blue">{job.category}</span>
                    </td>
                    <td className="px-6 py-3 font-semibold">{formatIndianNumber(job.totalVacancies)}</td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(job.applicationEnd)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="rounded px-2 py-1 text-xs font-medium text-secondary-600 hover:bg-secondary-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
