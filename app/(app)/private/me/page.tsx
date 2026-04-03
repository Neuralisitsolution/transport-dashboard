'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import SummaryCard from '@/components/ui/SummaryCard';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ImageUpload from '@/components/ui/ImageUpload';
import { formatIndianCurrency, formatDate, getTodayString, PAYMENT_MODES } from '@/lib/utils';

interface Trip {
  id: string; date: string; material: string; quantity: number; unit: string;
  ratePerUnit: number; totalAmount: number;
}
interface Payment {
  id: string; date: string; amount: number; paymentMode: string;
  screenshotUrl: string | null; verifiedByOwner: boolean; notes: string | null;
}
interface MemberData {
  id: string; name: string;
  trips: Trip[]; payments: Payment[];
  thisMonthCredit: number; thisMonthPaid: number; totalOutstanding: number;
}

export default function PrivateMemberSelfPage() {
  const { data: session } = useSession();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [payForm, setPayForm] = useState({
    date: getTodayString(), amount: '', paymentMode: 'UPI',
    notes: '', screenshotUrl: '', screenshotDriveId: '',
  });

  const fetchData = useCallback(async () => {
    if (!session?.user?.privateMemberId) return;
    try {
      const res = await fetch(`/api/private/${session.user.privateMemberId}`);
      if (!res.ok) throw new Error();
      setMember(await res.json());
    } catch {
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.privateMemberId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.amount || Number(payForm.amount) <= 0) { toast.error('Amount must be greater than 0'); return; }
    if (!member) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/private/${member.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payForm,
          amount: Number(payForm.amount),
          submittedByMember: true,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('Payment submitted. Owner will verify shortly.');
      setShowPaymentModal(false);
      setPayForm({ date: getTodayString(), amount: '', paymentMode: 'UPI', notes: '', screenshotUrl: '', screenshotDriveId: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit payment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

  if (!member) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Your account is not linked to a member profile yet.</p>
      <p className="text-gray-400 text-sm mt-2">Please ask the owner to set up your account.</p>
    </div>
  );

  const balanceDue = member.thisMonthCredit - member.thisMonthPaid;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {member.name}</h1>
        <p className="text-gray-500 mt-1">Your account overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <SummaryCard title="This Month Credit" value={formatIndianCurrency(member.thisMonthCredit)} color="red" />
        <SummaryCard title="This Month Paid" value={formatIndianCurrency(member.thisMonthPaid)} color="green" />
        <SummaryCard title="Balance Due" value={formatIndianCurrency(balanceDue)} color={balanceDue > 0 ? 'amber' : 'green'} />
      </div>

      {/* Trips Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Trips</h2>
        {member.trips.length === 0 ? (
          <EmptyState message="No trips recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Material</th>
                <th className="pb-3 pr-4 font-medium">Qty</th>
                <th className="pb-3 pr-4 font-medium">Rate</th>
                <th className="pb-3 pr-4 font-medium">Total</th>
              </tr></thead>
              <tbody>
                {member.trips.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4">{t.material}</td>
                    <td className="py-3 pr-4">{t.quantity} {t.unit}</td>
                    <td className="py-3 pr-4">{formatIndianCurrency(t.ratePerUnit)}</td>
                    <td className="py-3 pr-4 font-medium">{formatIndianCurrency(t.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payments Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Payments</h2>
          <button onClick={() => setShowPaymentModal(true)} className="btn-primary text-sm">+ Add Payment</button>
        </div>
        {member.payments.length === 0 ? (
          <EmptyState message="No payments submitted yet. Click Add Payment to submit one." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Mode</th>
                <th className="pb-3 pr-4 font-medium">Screenshot</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {member.payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{formatDate(p.date)}</td>
                    <td className="py-3 pr-4 font-medium text-green-700">{formatIndianCurrency(p.amount)}</td>
                    <td className="py-3 pr-4">{p.paymentMode}</td>
                    <td className="py-3 pr-4">
                      {p.screenshotUrl ? (
                        <a href={p.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View</a>
                      ) : '-'}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={p.verifiedByOwner ? 'badge-green' : 'badge-amber'}>
                        {p.verifiedByOwner ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Submit Payment">
        <form onSubmit={handleAddPayment} className="space-y-3">
          <div>
            <label className="label">Date</label>
            <input type="date" value={payForm.date} max={getTodayString()} onChange={(e) => setPayForm({ ...payForm, date: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label">Amount</label>
            <input type="number" step="0.01" min="0" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} className="input-field" placeholder="Enter amount paid" required />
          </div>
          <div>
            <label className="label">Payment Mode</label>
            <select value={payForm.paymentMode} onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })} className="input-field">
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Payment Screenshot (PhonePe / GPay etc.)</label>
            <ImageUpload
              subfolder="PaymentScreenshots"
              label="Upload Screenshot"
              onUpload={(fileId, viewUrl) => setPayForm({ ...payForm, screenshotDriveId: fileId, screenshotUrl: viewUrl })}
            />
            {payForm.screenshotUrl && <p className="text-xs text-green-600 mt-1">Screenshot uploaded</p>}
          </div>
          <div>
            <label className="label">Notes</label>
            <input type="text" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} className="input-field" placeholder="Optional" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Submitting...' : 'Submit Payment'}</button>
        </form>
      </Modal>
    </div>
  );
}
