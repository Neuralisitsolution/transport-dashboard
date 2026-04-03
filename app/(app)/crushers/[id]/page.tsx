'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SummaryCard from '@/components/ui/SummaryCard';
import TabNav from '@/components/ui/TabNav';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import {
  formatIndianCurrency,
  formatDate,
  formatDateForInput,
  getTodayString,
  MATERIALS,
  UNITS,
  PAYMENT_MODES,
} from '@/lib/utils';

interface CrusherCreditEntry {
  id: string;
  date: string;
  material: string;
  quantity: number;
  unit: string;
  ratePerUnit: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
}

interface CrusherPayment {
  id: string;
  date: string;
  amount: number;
  paymentMode: string;
  referenceNumber: string | null;
  notes: string | null;
  createdAt: string;
}

interface CrusherDetail {
  id: string;
  name: string;
  contactName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  credits: CrusherCreditEntry[];
  payments: CrusherPayment[];
  totalCredit: number;
  totalPaid: number;
  balance: number;
}

const TABS = [
  { key: 'credits', label: 'Credit Entries' },
  { key: 'payments', label: 'Payments Made' },
];

export default function CrusherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const crusherId = params.id as string;

  const [crusher, setCrusher] = useState<CrusherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credits');

  // Credit modal
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditSubmitting, setCreditSubmitting] = useState(false);
  const [creditForm, setCreditForm] = useState({
    date: getTodayString(),
    material: MATERIALS[0],
    quantity: '',
    unit: UNITS[0],
    ratePerUnit: '',
    totalAmount: '',
    notes: '',
  });

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    date: getTodayString(),
    amount: '',
    paymentMode: PAYMENT_MODES[0],
    referenceNumber: '',
    notes: '',
  });

  const fetchCrusher = async () => {
    try {
      const res = await fetch(`/api/crushers/${crusherId}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Crusher not found');
          router.push('/crushers');
          return;
        }
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setCrusher(data);
    } catch {
      toast.error('Failed to load crusher details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrusher();
  }, [crusherId]);

  // Auto-calculate total amount when quantity or rate changes
  useEffect(() => {
    const qty = parseFloat(creditForm.quantity);
    const rate = parseFloat(creditForm.ratePerUnit);
    if (!isNaN(qty) && !isNaN(rate) && qty > 0 && rate > 0) {
      setCreditForm((prev) => ({
        ...prev,
        totalAmount: (qty * rate).toFixed(2),
      }));
    }
  }, [creditForm.quantity, creditForm.ratePerUnit]);

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!creditForm.quantity || parseFloat(creditForm.quantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    if (!creditForm.ratePerUnit || parseFloat(creditForm.ratePerUnit) <= 0) {
      toast.error('Rate per unit must be greater than 0');
      return;
    }

    setCreditSubmitting(true);
    try {
      const res = await fetch(`/api/crushers/${crusherId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: creditForm.date,
          material: creditForm.material,
          quantity: parseFloat(creditForm.quantity),
          unit: creditForm.unit,
          ratePerUnit: parseFloat(creditForm.ratePerUnit),
          totalAmount: parseFloat(creditForm.totalAmount),
          notes: creditForm.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add credit entry');

      toast.success('Credit entry added successfully');
      setShowCreditModal(false);
      setCreditForm({
        date: getTodayString(),
        material: MATERIALS[0],
        quantity: '',
        unit: UNITS[0],
        ratePerUnit: '',
        totalAmount: '',
        notes: '',
      });
      fetchCrusher();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add credit entry');
    } finally {
      setCreditSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setPaymentSubmitting(true);
    try {
      const res = await fetch(`/api/crushers/${crusherId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: paymentForm.date,
          amount: parseFloat(paymentForm.amount),
          paymentMode: paymentForm.paymentMode,
          referenceNumber: paymentForm.referenceNumber,
          notes: paymentForm.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add payment');

      toast.success('Payment added successfully');
      setShowPaymentModal(false);
      setPaymentForm({
        date: getTodayString(),
        amount: '',
        paymentMode: PAYMENT_MODES[0],
        referenceNumber: '',
        notes: '',
      });
      fetchCrusher();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add payment');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!crusher) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/crushers')}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Crushers
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{crusher.name}</h1>
        {(crusher.contactName || crusher.phone || crusher.address) && (
          <div className="mt-1 text-sm text-gray-500 space-y-0.5">
            {crusher.contactName && <p>{crusher.contactName}</p>}
            {crusher.phone && <p>{crusher.phone}</p>}
            {crusher.address && <p>{crusher.address}</p>}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Total Credit Taken"
          value={formatIndianCurrency(crusher.totalCredit)}
          color="red"
        />
        <SummaryCard
          title="Total Paid"
          value={formatIndianCurrency(crusher.totalPaid)}
          color="green"
        />
        <SummaryCard
          title="Balance Due to Crusher"
          value={formatIndianCurrency(crusher.balance)}
          color="amber"
        />
      </div>

      {/* Tabs */}
      <TabNav tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Credit Entries Tab */}
      {activeTab === 'credits' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowCreditModal(true)} className="btn-primary">
              Add Credit Entry
            </button>
          </div>

          {crusher.credits.length === 0 ? (
            <EmptyState
              message="No credit entries yet. Click Add Credit Entry to record a purchase."
              actionLabel="Add Credit Entry"
              onAction={() => setShowCreditModal(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-3 px-3 font-medium">Date</th>
                    <th className="py-3 px-3 font-medium">Material</th>
                    <th className="py-3 px-3 font-medium text-right">Quantity</th>
                    <th className="py-3 px-3 font-medium text-right">Rate/Unit</th>
                    <th className="py-3 px-3 font-medium text-right">Total</th>
                    <th className="py-3 px-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {crusher.credits.map((credit) => (
                    <tr key={credit.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 whitespace-nowrap">{formatDate(credit.date)}</td>
                      <td className="py-3 px-3">{credit.material}</td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {credit.quantity} {credit.unit}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {formatIndianCurrency(credit.ratePerUnit)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-red-600">
                        {formatIndianCurrency(credit.totalAmount)}
                      </td>
                      <td className="py-3 px-3 text-gray-500 max-w-[150px] truncate">
                        {credit.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary">
              Add Payment
            </button>
          </div>

          {crusher.payments.length === 0 ? (
            <EmptyState
              message="No payments recorded yet. Click Add Payment to record a payment."
              actionLabel="Add Payment"
              onAction={() => setShowPaymentModal(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-3 px-3 font-medium">Date</th>
                    <th className="py-3 px-3 font-medium text-right">Amount</th>
                    <th className="py-3 px-3 font-medium">Payment Mode</th>
                    <th className="py-3 px-3 font-medium">Reference No.</th>
                    <th className="py-3 px-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {crusher.payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 whitespace-nowrap">{formatDate(payment.date)}</td>
                      <td className="py-3 px-3 text-right font-semibold text-green-600">
                        {formatIndianCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-3">{payment.paymentMode}</td>
                      <td className="py-3 px-3 text-gray-500">{payment.referenceNumber || '-'}</td>
                      <td className="py-3 px-3 text-gray-500 max-w-[150px] truncate">
                        {payment.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Credit Entry Modal */}
      <Modal
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        title="Add Credit Entry"
      >
        <form onSubmit={handleCreditSubmit} className="space-y-4">
          <div>
            <label className="label">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="input-field"
              value={creditForm.date}
              max={getTodayString()}
              onChange={(e) => setCreditForm({ ...creditForm, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">
              Material <span className="text-red-500">*</span>
            </label>
            <select
              className="input-field"
              value={creditForm.material}
              onChange={(e) => setCreditForm({ ...creditForm, material: e.target.value })}
              required
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                className="input-field"
                value={creditForm.quantity}
                onChange={(e) => setCreditForm({ ...creditForm, quantity: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="label">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={creditForm.unit}
                onChange={(e) => setCreditForm({ ...creditForm, unit: e.target.value })}
                required
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                Rate per Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                className="input-field"
                value={creditForm.ratePerUnit}
                onChange={(e) => setCreditForm({ ...creditForm, ratePerUnit: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="label">Total Amount</label>
              <input
                type="number"
                step="any"
                className="input-field bg-gray-50"
                value={creditForm.totalAmount}
                readOnly
                placeholder="Auto-calculated"
              />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input-field"
              rows={2}
              value={creditForm.notes}
              onChange={(e) => setCreditForm({ ...creditForm, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreditModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={creditSubmitting}>
              {creditSubmitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Add Payment"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="label">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="input-field"
              value={paymentForm.date}
              max={getTodayString()}
              onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              className="input-field"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <label className="label">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <select
              className="input-field"
              value={paymentForm.paymentMode}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
              required
            >
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Reference Number</label>
            <input
              type="text"
              className="input-field"
              value={paymentForm.referenceNumber}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })
              }
              placeholder="Transaction/Cheque number"
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input-field"
              rows={2}
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={paymentSubmitting}>
              {paymentSubmitting ? 'Adding...' : 'Add Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
