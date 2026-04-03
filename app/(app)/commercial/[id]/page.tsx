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
  referenceNumber: string | null; notes: string | null;
}
interface ClientData {
  id: string; companyName: string; contactName: string | null;
  phone: string | null; address: string | null;
  trips: Trip[]; payments: Payment[];
  totalTrips: number; totalBilled: number; totalPaid: number;
}

export default function CommercialClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
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
      const [clientRes, lorryRes] = await Promise.all([
        fetch(`/api/commercial/${id}`),
        fetch('/api/fleet'),
      ]);
      if (!clientRes.ok) throw new Error('Failed to load client');
      const clientData = await clientRes.json();
      const lorryData = await lorryRes.json();
      setClient(clientData);
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
      const res = await fetch(`/api/commercial/${id}/trips`, {
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
      const res = await fetch(`/api/commercial/${id}/payments`, {
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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  if (!client) return <div className="text-center py-20 text-gray-500">Client not found</div>;

  const amountDue = client.totalBilled - client.totalPaid;

  return (
    <div>
      <button onClick={() => router.push('/commercial')} className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Clients
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{client.companyName}</h1>
        {client.contactName && <p className="text-gray-500 mt-1">{client.contactName}</p>}
        {client.phone && <p className="text-gray-500">{client.phone}</p>}
        {client.address && <p className="text-gray-500">{client.address}</p>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard title="Total Trips" value={String(client.totalTrips)} color="blue" />
        <SummaryCard title="Total Billed" value={formatIndianCurrency(client.totalBilled)} color="blue" />
        <SummaryCard title="Total Paid" value={formatIndianCurrency(client.totalPaid)} color="green" />
        <SummaryCard title="Amount Due" value={formatIndianCurrency(amountDue)} color={amountDue > 0 ? 'red' : 'green'} />
      </div>

      <TabNav tabs={[{ key: 'trips', label: 'Trips' }, { key: 'payments', label: 'Payments' }]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'trips' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowTripModal(true)} className="btn-primary text-sm">+ Add Trip</button>
          </div>
          {client.trips.length === 0 ? (
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
                  {client.trips.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4">{formatDate(t.date)}</td>
                      <td className="py-3 pr-4">{t.lorry.registrationNumber}</td>
                      <td className="py-3 pr-4">{t.material}</td>
                      <td className="py-3 pr-4">{t.quantity} {t.unit}</td>
                      <td className="py-3 pr-4">{formatIndianCurrency(t.ratePerUnit)}</td>
                      <td className="py-3 pr-4 font-medium">{formatIndianCurrency(t.totalAmount)}</td>
                      <td className="py-3 pr-4">
                        {t.slipImageUrl ? (
                          <a href={t.slipImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View Slip</a>
                        ) : t.slipNumber ? <span className="text-xs text-gray-400">#{t.slipNumber}</span> : '-'}
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
          {client.payments.length === 0 ? (
            <EmptyState message="No payments received yet. Click Add Payment to record one." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Mode</th>
                  <th className="pb-3 pr-4 font-medium">Reference</th>
                  <th className="pb-3 pr-4 font-medium">Notes</th>
                </tr></thead>
                <tbody>
                  {client.payments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4">{formatDate(p.date)}</td>
                      <td className="py-3 pr-4 font-medium text-green-700">{formatIndianCurrency(p.amount)}</td>
                      <td className="py-3 pr-4">{p.paymentMode}</td>
                      <td className="py-3 pr-4">{p.referenceNumber || '-'}</td>
                      <td className="py-3 pr-4 text-gray-500">{p.notes || '-'}</td>
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
              <input type="number" step="0.01" min="0" value={tripForm.quantity} onChange={(e) => setTripForm({ ...tripForm, quantity: e.target.value })} className="input-field" placeholder="0" required />
            </div>
            <div>
              <label className="label">Rate per Unit</label>
              <input type="number" step="0.01" min="0" value={tripForm.ratePerUnit} onChange={(e) => setTripForm({ ...tripForm, ratePerUnit: e.target.value })} className="input-field" placeholder="0" required />
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
            <ImageUpload subfolder="CommercialSlips" onUpload={(fileId, viewUrl) => setTripForm({ ...tripForm, slipImageDriveId: fileId, slipImageUrl: viewUrl })} />
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
            <input type="number" step="0.01" min="0" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} className="input-field" placeholder="0" required />
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
