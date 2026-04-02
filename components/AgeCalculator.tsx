'use client';

import { useState } from 'react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [refDate, setRefDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

  function calculate() {
    if (!dob || !refDate) return;

    const birth = new Date(dob);
    const ref = new Date(refDate);

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days });
  }

  const ageRelaxations = result
    ? [
        { category: 'General', maxAge: 'No relaxation', eligible: result.years },
        { category: 'OBC', maxAge: '+3 years', eligible: result.years },
        { category: 'SC/ST', maxAge: '+5 years', eligible: result.years },
        { category: 'PwD (General)', maxAge: '+10 years', eligible: result.years },
        { category: 'PwD (OBC)', maxAge: '+13 years', eligible: result.years },
        { category: 'PwD (SC/ST)', maxAge: '+15 years', eligible: result.years },
        { category: 'Ex-Serviceman', maxAge: '+5 years', eligible: result.years },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Reference Date (Exam/Notification Date)</label>
          <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)} className="input-field" />
        </div>
      </div>

      <button onClick={calculate} className="btn-primary w-full">
        Calculate Age
      </button>

      {result && (
        <>
          <div className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-center text-white">
            <p className="text-sm font-medium text-white/80">Your Age on {new Date(refDate).toLocaleDateString('en-IN')}</p>
            <p className="mt-2 text-3xl font-bold">
              {result.years} Years, {result.months} Months, {result.days} Days
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Age Relaxation Guide</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Category</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Relaxation</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Eligible for Max Age</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'General', relax: 'No relaxation', bonus: 0 },
                    { cat: 'OBC', relax: '+3 years', bonus: 3 },
                    { cat: 'SC/ST', relax: '+5 years', bonus: 5 },
                    { cat: 'PwD (General)', relax: '+10 years', bonus: 10 },
                    { cat: 'PwD (OBC)', relax: '+13 years', bonus: 13 },
                    { cat: 'PwD (SC/ST)', relax: '+15 years', bonus: 15 },
                    { cat: 'Ex-Serviceman', relax: '+5 years', bonus: 5 },
                  ].map((row) => (
                    <tr key={row.cat} className="border-b">
                      <td className="px-4 py-2 font-medium text-gray-900">{row.cat}</td>
                      <td className="px-4 py-2 text-gray-600">{row.relax}</td>
                      <td className="px-4 py-2">
                        <span className="text-gray-700">Up to {result.years + row.bonus} yrs eligible range</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-yellow-50 p-4">
            <h4 className="font-semibold text-yellow-800">Common Age Limits for Govt Exams</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {[
                { exam: 'SSC CGL', min: 18, max: 32 },
                { exam: 'SSC CHSL', min: 18, max: 27 },
                { exam: 'UPSC CSE', min: 21, max: 32 },
                { exam: 'IBPS PO', min: 20, max: 30 },
                { exam: 'RRB NTPC', min: 18, max: 33 },
                { exam: 'NDA', min: 16, max: 19 },
                { exam: 'CDS', min: 19, max: 25 },
                { exam: 'Indian Army', min: 17, max: 21 },
              ].map((exam) => {
                const isEligible = result.years >= exam.min && result.years <= exam.max;
                return (
                  <div key={exam.exam} className={`rounded-lg p-2 text-center ${isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <p className="font-medium">{exam.exam}</p>
                    <p className="text-xs">{exam.min}-{exam.max} yrs</p>
                    <p className="text-xs font-semibold">{isEligible ? 'Eligible' : 'Not Eligible'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
