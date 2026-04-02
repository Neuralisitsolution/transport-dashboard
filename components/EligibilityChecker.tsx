'use client';

import { useState } from 'react';
import { EDUCATION_LEVELS, RESERVATION_CATEGORIES } from '@/lib/constants';

interface EligibilityCheckerProps {
  job?: {
    eligibility: {
      age: { min: number; max: number };
      education: string;
    };
    title: string;
  };
}

export default function EligibilityChecker({ job }: EligibilityCheckerProps) {
  const [dob, setDob] = useState('');
  const [education, setEducation] = useState('');
  const [category, setCategory] = useState('General');
  const [result, setResult] = useState<{ eligible: boolean; reasons: string[] } | null>(null);

  function checkEligibility() {
    const reasons: string[] = [];
    let eligible = true;

    if (dob && job) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      let maxAge = job.eligibility.age.max;
      if (category === 'OBC') maxAge += 3;
      else if (category === 'SC' || category === 'ST') maxAge += 5;
      else if (category === 'PwD') maxAge += 10;

      if (age < job.eligibility.age.min) {
        eligible = false;
        reasons.push(`Age ${age} is below minimum age of ${job.eligibility.age.min} years`);
      } else if (age > maxAge) {
        eligible = false;
        reasons.push(`Age ${age} exceeds maximum age of ${maxAge} years (including relaxation for ${category})`);
      } else {
        reasons.push(`Age ${age} is within the eligible range (${job.eligibility.age.min}-${maxAge} years)`);
      }
    }

    if (!dob) {
      reasons.push('Enter your date of birth to check age eligibility');
    }

    if (education) {
      reasons.push(`Education: ${education} - Please verify this meets the requirement: ${job?.eligibility.education || 'Check notification'}`);
    }

    setResult({ eligible, reasons });
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Check Your Eligibility
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Education</label>
          <select value={education} onChange={(e) => setEducation(e.target.value)} className="input-field">
            <option value="">Select Education</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            {RESERVATION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button onClick={checkEligibility} className="btn-primary w-full">
          Check Eligibility
        </button>
      </div>

      {result && (
        <div className={`mt-4 rounded-lg p-4 ${result.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-semibold ${result.eligible ? 'text-green-800' : 'text-red-800'}`}>
            {result.eligible ? 'You appear to be eligible!' : 'You may not be eligible'}
          </p>
          <ul className="mt-2 space-y-1">
            {result.reasons.map((reason, i) => (
              <li key={i} className="text-sm text-gray-700">- {reason}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            *This is an approximate check. Always verify with the official notification.
          </p>
        </div>
      )}
    </div>
  );
}
