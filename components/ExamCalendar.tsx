'use client';

import { useState } from 'react';

const SAMPLE_EVENTS = [
  { date: '2025-06-15', title: 'SSC CGL 2025 Application Start', category: 'Central Govt', type: 'application' },
  { date: '2025-06-20', title: 'IBPS PO 2025 Notification', category: 'Banking', type: 'notification' },
  { date: '2025-07-01', title: 'UPSC CSE Prelims 2025', category: 'Central Govt', type: 'exam' },
  { date: '2025-07-10', title: 'RRB NTPC CBT-1 Admit Card', category: 'Central Govt', type: 'admitcard' },
  { date: '2025-07-15', title: 'SSC CHSL Application Deadline', category: 'Central Govt', type: 'deadline' },
  { date: '2025-08-01', title: 'SBI PO Prelims', category: 'Banking', type: 'exam' },
  { date: '2025-08-15', title: 'NDA 2 Exam 2025', category: 'Defence', type: 'exam' },
  { date: '2025-09-01', title: 'SSC CGL Tier-1 Exam', category: 'Central Govt', type: 'exam' },
  { date: '2025-09-10', title: 'IBPS Clerk Notification', category: 'Banking', type: 'notification' },
  { date: '2025-10-01', title: 'UPSC CSE Mains', category: 'Central Govt', type: 'exam' },
  { date: '2025-10-15', title: 'RBI Grade B Result', category: 'Banking', type: 'result' },
  { date: '2025-11-01', title: 'KVS Teacher Recruitment', category: 'Teaching', type: 'notification' },
];

const typeColors: Record<string, string> = {
  exam: 'bg-red-100 text-red-800 border-red-200',
  application: 'bg-green-100 text-green-800 border-green-200',
  deadline: 'bg-orange-100 text-orange-800 border-orange-200',
  notification: 'bg-blue-100 text-blue-800 border-blue-200',
  admitcard: 'bg-purple-100 text-purple-800 border-purple-200',
  result: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export default function ExamCalendar() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = selectedCategory
    ? SAMPLE_EVENTS.filter((e) => e.category === selectedCategory)
    : SAMPLE_EVENTS;

  const grouped = filtered.reduce<Record<string, typeof SAMPLE_EVENTS>>((acc, event) => {
    const month = new Date(event.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['', 'Central Govt', 'Banking', 'Defence', 'Teaching', 'State Govt'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat || 'All'}
          </button>
        ))}
      </div>

      {Object.entries(grouped).map(([month, events]) => (
        <div key={month}>
          <h3 className="mb-3 text-lg font-bold text-gray-900">{month}</h3>
          <div className="space-y-2">
            {events.map((event, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 rounded-lg border p-4 ${typeColors[event.type] || 'bg-gray-50'}`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{new Date(event.date).getDate()}</div>
                  <div className="text-xs uppercase">
                    {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-xs opacity-75">{event.category} - {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="rounded-xl border bg-gray-50 p-12 text-center">
          <p className="text-gray-500">No events found for the selected category.</p>
        </div>
      )}
    </div>
  );
}
