'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SummaryCard from '@/components/ui/SummaryCard';
import TabNav from '@/components/ui/TabNav';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ImageUpload from '@/components/ui/ImageUpload';
import { formatIndianCurrency, formatDate, getTodayString, MATERIALS, UNITS, PAYMENT_MODES } from '@/lib/utils';

interface Lorry { id: string; registrationNumber: string; }
interface Trip {
  id: string; date: string; material: string; quantity: number; unit: string;
  ratePerUnit: number; totalAmount: number; slipNumber: string | null;
  slipImageUrl: string | null; notes: string | null;
  lorry: { registrationNumber: string };
}
interface Payment {
  id: string; date: string; amount: number; paymentMode: string;
  referenceNumber: string | null; screenshotUrl: string | null;
  submittedByMember: boolean; verifiedByOwner: boolean; notes: string | null;
}
interface MemberData {
  id: string; name: string; phone: string | null; address: string | null;
  trips: Trip[]; payments: Payment[];
  thisMonthCredit: number; thisMonthPaid: number; totalOutstanding: number;
}

export default function PrivateMemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [lorries, setLorries] = useState<Lorry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trips');
  const [showTripModal, setShowTripModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [tripForm, setTripForm] = useState({
    date: getTodayString(), lorryId: '', material: '20mm', quantity: '',
    unit: 'MT', ratePerUnit: '', slipNumber: '', notes: '',
    slipImageUrl: '', slipImageDriveId: '',
  });

  const [payForm, setPayForm] = useState({
    date: getTodayString(), amount: '', paymentMode: 'Cash',
    referenceNumber: '', notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [memberRes, lorryRes] = await Promise.all([
        fetch(`/api/private/${id}`),
        fetch('/api/fleet'),
      ]);
      if (!memberRes.ok) throw new Error();
      const memberData = await memberRes.json();
      const lorryData = await lorryRes.json();
      setMember(memberData);
      setLorries((lorryData || []).filter((l: any) => l.isActive));
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tripTotal = Number(tripForm.quantity || 0) * Number(tripForm.ratePerUnit || 0);

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripForm.lorryId) { toast.error('Please select a lorry'); return; }
    if (!tripForm.quantity || Number(tripForm.quantity) <= 0) { toast.error('Quantity must be greater than 0'); return; }
    if (!tripForm.ratePerUnit || Number(tripForm.ratePerUnit) <= 0) { toast.error('Rate must be greater than 0'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/private/${id}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tripForm,
          quantity: Number(tripForm.quantity),
          ratePerUnit: Number(tripForm.ratePerUnit),
          totalAmount: tripTotal,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('Trip added!');
      setShowTripModal(false);
      setTripForm({ date: getTodayString(), lorryId: '', material: '20mm', quantity: '', unit: 'MT', ratePerUnit: '', slipNumber: '', notes: '', slipImageUrl: '', slipImageDriveId: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add trip');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.amount || Number(payForm.amount) <= 0) { toast.error('Amount must be greater than 0'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/private/${id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payForm, amount: Number(payForm.amount) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('Payment added!');
      setShowPaymentModal(false);
      setPayForm({ date: getTodayString(), amount: '', paymentMode: 'Cash', referenceNumber: '', notes: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add payment');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/private/${id}/payments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });
      if (!res.ok) throw new Error();
      toast.success('Payment verified!');
      fetchData();
    } catch {
      toast.error('Failed to verify payment');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  if (!member) return <div className="text-center py-20 text-gray-500">Member not found</div>;

  const thisMonthBalance = member.thisMonthCredit - member.thisMonthPaid;

  return (
    <div>
      <button onClick={() => router.push('/private')} className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Members
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
        {member.phone && <p className="text-gray-500 mt-1">{member.phone}</p>}
        {member.address && <p className="text-gray-500">{member.address}</p>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard title="This Month Credit" value={formatIndianCurrency(member.thisMonthCredit)} color="red" />
        <SummaryCard title="This Month Paid" value={formatIndianCurrency(member.thisMonthPaid)} color="green" />
        <SummaryCard title="This Month Balance" value={formatIndianCurrency(thisMonthBalance)} color={thisMonthBalance > 0 ? 'amber' : 'green'} />
        <SummaryCard title="Total Outstanding" value={formatIndianCurrency(member.totalOutstanding)} color={member.totalOutstanding > 0 ? 'red' : 'green'} />
      </div>

      <TabNav tabs={[{ key: 'trips', label: 'Trips' }, { key: 'payments', label: 'Payments' }]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'trips' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowTripModal(true)} className="btn-primary text-sm">+ Add Trip</button>
          </div>
          {member.trips.length === 0 ? (
            <EmptyState message="No trips added yet. Click Add Trip to get started." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Lorry</th>
                  <th className="pb-3 pr-4 font-medium">Material</th>
                  <th className="pb-3 pr-4 font-medium">Qty</th>
                  <th className="pb-3 pr-4 font-medium">Rate</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 pr-4 font-medium">Slip</th>
                </tr></thead>
                <tbody>
                  {member.trips.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4">{formatDate(t.date)}</td>
                      <td className="py-3 pr-4">{t.lorry.registrationNumber}</td>
                      <td className="py-3 pr-4">{t.material}</td>
                      <td className="py-3 pr-4">{t.quantity} {t.unit}</td>
                      <td className="py-3 pr-4">{formatIndianCurrency(t.ratePerUnit)}</td>
                      <td className="py-3 pr-4 font-medium">{formatIndianCurrency(t.totalAmount)}</td>
                      <td className="py-3 pr-4">
                        {t.slipImageUrl ? (
                          <a href={t.slipImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View</a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary text-sm">+ Add Payment</button>
          </div>
          {member.payments.length === 0 ? (
            <EmptyState message="No payments recorded yet. Click Add Payment to record one." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Mode</th>
                  <th className="pb-3 pr-4 font-medium">Screenshot</th>
                  <th className="pb-3 pr-4 font-medium">Added By</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Action</th>
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
                        <span className={p.submittedByMember ? 'badge-blue' : 'badge-amber'}>
                          {p.submittedByMember ? 'Member' : 'Owner'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={p.verifiedByOwner ? 'badge-green' : 'badge-amber'}>
                          {p.verifiedByOwner ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {!p.verifiedByOwner && (
                          <button onClick={() => handleVerify(p.id)} className="text-green-600 hover:underline text-xs font-medium">
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Trip Modal */}
      <Modal open={showTripModal} onClose={() => setShowTripModal(false)} title="Add Trip">
        <form onSubmit={handleAddTrip} className="space-y-3">
          <div>
            <label className="label">Date</label>
            <input type="date" value={tripForm.date} max={getTodayString()} onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label">Lorry</label>
            <select value={tripForm.lorryId} onChange={(e) => setTripForm({ ...tripForm, lorryId: e.target.value })} className="input-field" required>
              <option value="">Select lorry...</option>
              {lorries.map((l) => <option key={l.id} value={l.id}>{l.registrationNumber}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Material</label>
              <select value={tripForm.material} onChange={(e) => setTripForm({ ...tripForm, material: e.target.value })} className="input-field">
                {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Unit</label>
              <select value={tripForm.unit} onChange={(e) => setTripForm({ ...tripForm, unit: e.target.value })} className="input-field">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Quantity</label>
              <input type="number" step="0.01" min="0" value={tripForm.quantity} onChange={(e) => setTripForm({ ...tripForm, quantity: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="label">Rate per Unit</label>
              <input type="number" step="0.01" min="0" value={tripForm.ratePerUnit} onChange={(e) => setTripForm({ ...tripForm, ratePerUnit: e.target.value })} className="input-field" required />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-sm text-gray-500">Total: </span>
            <span className="text-lg font-bold text-gray-900">{formatIndianCurrency(tripTotal)}</span>
          </div>
          <div>
            <label className="label">Slip Number</label>
            <input type="text" value={tripForm.slipNumber} onChange={(e) => setTripForm({ ...tripForm, slipNumber: e.target.value })} className="input-field" placeholder="Optional" />
          </div>
          <div>
            <label className="label">Slip Photo</label>
            <ImageUpload subfolder="PrivateSlips" onUpload={(fileId, viewUrl) => setTripForm({ ...tripForm, slipImageDriveId: fileId, slipImageUrl: viewUrl })} />
            {tripForm.slipImageUrl && <p className="text-xs text-green-600 mt-1">Photo uploaded</p>}
          </div>
          <div>
            <label className="label">Notes</label>
            <input type="text" value={tripForm.notes} onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })} className="input-field" placeholder="Optional" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Add Trip'}</button>
        </form>
      </Modal>

      {/* Add Payment Modal */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Add Payment">
        <form onSubmit={handleAddPayment} className="space-y-3">
          <div>
            <label className="label">Date</label>
            <input type="date" value={payForm.date} max={getTodayString()} onChange={(e) => setPayForm({ ...payForm, date: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label">Amount</label>
            <input type="number" step="0.01" min="0" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label">Payment Mode</label>
            <select value={payForm.paymentMode} onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })} className="input-field">
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Reference Number</label>
            <input type="text" value={payForm.referenceNumber} onChange={(e) => setPayForm({ ...payForm, referenceNumber: e.target.value })} className="input-field" placeholder="Optional" />
          </div>
          <div>
            <label className="label">Notes</label>
            <input type="text" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} className="input-field" placeholder="Optional" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Add Payment'}</button>
        </form>
      </Modal>
    </div>
  );
}
