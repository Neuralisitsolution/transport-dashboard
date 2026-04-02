'use client';

import { useState } from 'react';
import { PAY_LEVELS, formatIndianNumber } from '@/lib/constants';

export default function SalaryCalculator() {
  const [payLevel, setPayLevel] = useState(7);
  const [cityType, setCityType] = useState<'X' | 'Y' | 'Z'>('X');
  const [daRate, setDaRate] = useState(50);

  const basicPay = PAY_LEVELS[payLevel]?.min || 0;

  const daAmount = Math.round(basicPay * (daRate / 100));
  const hraPercent = cityType === 'X' ? 27 : cityType === 'Y' ? 18 : 9;
  const hraAmount = Math.round(basicPay * (hraPercent / 100));
  const taAmount = payLevel <= 8 ? 3600 : payLevel <= 13 ? 7200 : 14400;

  const grossSalary = basicPay + daAmount + hraAmount + taAmount;

  const nps = Math.round(basicPay * 0.1);
  const cghs = payLevel <= 5 ? 250 : payLevel <= 10 ? 450 : 650;
  const incomeTax = grossSalary > 100000 ? Math.round((grossSalary - 50000) * 0.2) : grossSalary > 50000 ? Math.round((grossSalary - 50000) * 0.05) : 0;

  const totalDeductions = nps + cghs + incomeTax;
  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Pay Level (1-18)</label>
          <select value={payLevel} onChange={(e) => setPayLevel(Number(e.target.value))} className="input-field">
            {Object.keys(PAY_LEVELS).map((level) => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">City Category</label>
          <select value={cityType} onChange={(e) => setCityType(e.target.value as 'X' | 'Y' | 'Z')} className="input-field">
            <option value="X">X (Metro - Delhi, Mumbai, etc.)</option>
            <option value="Y">Y (Other Cities 50L+ population)</option>
            <option value="Z">Z (Other Places)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">DA Rate (%)</label>
          <input type="number" value={daRate} onChange={(e) => setDaRate(Number(e.target.value))} className="input-field" min={0} max={100} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-green-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-green-800">Earnings</h3>
          <div className="space-y-3">
            {[
              { label: 'Basic Pay', value: basicPay },
              { label: `Dearness Allowance (${daRate}%)`, value: daAmount },
              { label: `House Rent Allowance (${hraPercent}%)`, value: hraAmount },
              { label: 'Transport Allowance', value: taAmount },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900">₹{formatIndianNumber(item.value)}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-800">Gross Salary</span>
                <span className="text-lg font-bold text-green-700">₹{formatIndianNumber(grossSalary)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-red-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-red-800">Deductions</h3>
          <div className="space-y-3">
            {[
              { label: 'NPS (10%)', value: nps },
              { label: 'CGHS', value: cghs },
              { label: 'Income Tax (approx)', value: incomeTax },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900">₹{formatIndianNumber(item.value)}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-800">Total Deductions</span>
                <span className="text-lg font-bold text-red-700">₹{formatIndianNumber(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-center text-white">
        <p className="text-sm font-medium text-white/80">Net In-Hand Salary (Approx)</p>
        <p className="mt-1 text-4xl font-bold">₹{formatIndianNumber(netSalary)}</p>
        <p className="mt-1 text-sm text-white/70">per month</p>
      </div>

      <p className="text-xs text-gray-500 text-center">
        *This is an approximate calculation based on 7th CPC. Actual salary may vary based on additional allowances and deductions.
      </p>
    </div>
  );
}
