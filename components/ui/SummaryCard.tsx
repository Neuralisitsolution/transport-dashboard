'use client';

interface SummaryCardProps {
  title: string;
  value: string;
  color?: 'green' | 'red' | 'amber' | 'blue' | 'gray';
  subtitle?: string;
}

const colorMap = {
  green: 'text-green-700 bg-green-50 border-green-200',
  red: 'text-red-700 bg-red-50 border-red-200',
  amber: 'text-amber-700 bg-amber-50 border-amber-200',
  blue: 'text-blue-700 bg-blue-50 border-blue-200',
  gray: 'text-gray-700 bg-white border-gray-200',
};

export default function SummaryCard({ title, value, color = 'gray', subtitle }: SummaryCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="text-xs font-medium opacity-75 uppercase tracking-wide">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs mt-1 opacity-75">{subtitle}</p>}
    </div>
  );
}
