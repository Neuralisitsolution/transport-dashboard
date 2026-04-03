'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatIndianCurrency, formatDate, getTodayString, getMonthStartString } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

type DatePreset = 'today' | 'week' | 'month' | 'custom';

interface DashboardData {
  summary: {
    totalTrips: number; totalBilled: number; totalReceived: number;
    crusherOwed: number; commercialReceivable: number; privateReceivable: number;
    crusherPaidToday: number;
  };
  monthlyData: { month: string; billed: number; received: number; crusherCredit: number; crusherPaid: number }[];
  topCommercial: { name: string; outstanding: number }[];
  topPrivate: { name: string; outstanding: number }[];
  dailyReport: {
    trips: { type: string; client: string; lorry: string; material: string; quantity: number; unit: string; amount: number; date: string }[];
    paymentsReceived: { type: string; from: string; amount: number; mode: string; date: string }[];
    crusherPayments: { crusher: string; amount: number; mode: string; date: string }[];
    netCashFlow: number;
  };
  monthlyReport: {
    materialBreakdown: { material: string; quantity: number; amount: number; source: string }[];
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<DatePreset>('today');
  const [dateFrom, setDateFrom] = useState(getTodayString());
  const [dateTo, setDateTo] = useState(getTodayString());

  const fetchData = async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?dateFrom=${from}&dateTo=${to}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let from = getTodayString();
    let to = getTodayString();

    if (preset === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      from = d.toISOString().split('T')[0];
    } else if (preset === 'month') {
      from = getMonthStartString();
    } else if (preset === 'custom') {
      from = dateFrom;
      to = dateTo;
    }

    setDateFrom(from);
    setDateTo(to);
    fetchData(from, to);
  }, [preset]);

  const handleCustomFilter = () => {
    fetchData(dateFrom, dateTo);
  };

  const formatTooltipValue = (value: number) => formatIndianCurrency(value);

  if (loading && !data) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  }

  if (!data) return null;

  const s = data.summary;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          {(['today', 'week', 'month', 'custom'] as DatePreset[]).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                preset === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {preset === 'custom' && (
        <div className="flex flex-wrap items-end gap-3 mb-6">
          <div>
            <label className="label">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleCustomFilter} className="btn-primary text-sm">Apply</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <SummaryCard title="Total Trips" value={String(s.totalTrips)} color="blue" />
        <SummaryCard title="Total Billed" value={formatIndianCurrency(s.totalBilled)} color="blue" />
        <SummaryCard title="Payments Received" value={formatIndianCurrency(s.totalReceived)} color="green" />
        <SummaryCard title="Owed to Crushers" value={formatIndianCurrency(s.crusherOwed)} color="red" subtitle="All time balance" />
        <SummaryCard title="Commercial Receivable" value={formatIndianCurrency(s.commercialReceivable)} color="amber" subtitle="All time balance" />
        <SummaryCard title="Private Receivable" value={formatIndianCurrency(s.privateReceivable)} color="amber" subtitle="All time balance" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Billing vs Payments (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Bar dataKey="billed" name="Billed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" name="Received" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Crusher Credit vs Payments (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Bar dataKey="crusherCredit" name="Credit Taken" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="crusherPaid" name="Paid" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Outstanding Tables */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top 5 Commercial Clients by Outstanding</h3>
          {data.topCommercial.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No outstanding balances</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Client</th>
                <th className="pb-2 font-medium text-right">Outstanding</th>
              </tr></thead>
              <tbody>
                {data.topCommercial.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5">{c.name}</td>
                    <td className="py-2.5 text-right font-medium text-red-600">{formatIndianCurrency(c.outstanding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top 5 Private Members by Outstanding</h3>
          {data.topPrivate.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No outstanding balances</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Member</th>
                <th className="pb-2 font-medium text-right">Outstanding</th>
              </tr></thead>
              <tbody>
                {data.topPrivate.map((m, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5">{m.name}</td>
                    <td className="py-2.5 text-right font-medium text-red-600">{formatIndianCurrency(m.outstanding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Daily Report */}
      <div className="card mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Daily Report</h3>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Trips ({data.dailyReport.trips.length})</h4>
          {data.dailyReport.trips.length === 0 ? (
            <p className="text-sm text-gray-400">No trips for this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-3 font-medium">Type</th>
                  <th className="pb-2 pr-3 font-medium">Client</th>
                  <th className="pb-2 pr-3 font-medium">Lorry</th>
                  <th className="pb-2 pr-3 font-medium">Material</th>
                  <th className="pb-2 pr-3 font-medium text-right">Amount</th>
                </tr></thead>
                <tbody>
                  {data.dailyReport.trips.map((t, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3"><span className={t.type === 'Commercial' ? 'badge-blue' : 'badge-amber'}>{t.type}</span></td>
                      <td className="py-2 pr-3">{t.client}</td>
                      <td className="py-2 pr-3">{t.lorry}</td>
                      <td className="py-2 pr-3">{t.material}</td>
                      <td className="py-2 pr-3 text-right font-medium">{formatIndianCurrency(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Payments Received ({data.dailyReport.paymentsReceived.length})</h4>
          {data.dailyReport.paymentsReceived.length === 0 ? (
            <p className="text-sm text-gray-400">No payments received for this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-3 font-medium">Type</th>
                  <th className="pb-2 pr-3 font-medium">From</th>
                  <th className="pb-2 pr-3 font-medium">Mode</th>
                  <th className="pb-2 pr-3 font-medium text-right">Amount</th>
                </tr></thead>
                <tbody>
                  {data.dailyReport.paymentsReceived.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3"><span className={p.type === 'Commercial' ? 'badge-blue' : 'badge-amber'}>{p.type}</span></td>
                      <td className="py-2 pr-3">{p.from}</td>
                      <td className="py-2 pr-3">{p.mode}</td>
                      <td className="py-2 pr-3 text-right font-medium text-green-700">{formatIndianCurrency(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Crusher Payments Made ({data.dailyReport.crusherPayments.length})</h4>
          {data.dailyReport.crusherPayments.length === 0 ? (
            <p className="text-sm text-gray-400">No crusher payments for this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-3 font-medium">Crusher</th>
                  <th className="pb-2 pr-3 font-medium">Mode</th>
                  <th className="pb-2 pr-3 font-medium text-right">Amount</th>
                </tr></thead>
                <tbody>
                  {data.dailyReport.crusherPayments.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3">{p.crusher}</td>
                      <td className="py-2 pr-3">{p.mode}</td>
                      <td className="py-2 pr-3 text-right font-medium text-red-600">{formatIndianCurrency(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Net Cash Flow</span>
            <span className={`text-lg font-bold ${data.dailyReport.netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatIndianCurrency(data.dailyReport.netCashFlow)}
              <span className="text-xs ml-2 font-normal">{data.dailyReport.netCashFlow >= 0 ? '(Positive)' : '(Negative)'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Report */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Material Report</h3>
        {data.monthlyReport.materialBreakdown.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No material data for this month</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 pr-3 font-medium">Material</th>
                <th className="pb-2 pr-3 font-medium">Source</th>
                <th className="pb-2 pr-3 font-medium text-right">Quantity</th>
                <th className="pb-2 pr-3 font-medium text-right">Amount</th>
              </tr></thead>
              <tbody>
                {data.monthlyReport.materialBreakdown.map((m, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-3">{m.material}</td>
                    <td className="py-2 pr-3">{m.source}</td>
                    <td className="py-2 pr-3 text-right">{m.quantity}</td>
                    <td className="py-2 pr-3 text-right font-medium">{formatIndianCurrency(m.amount)}</td>
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
