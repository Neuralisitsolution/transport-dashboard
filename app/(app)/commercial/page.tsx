'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { formatIndianCurrency } from '@/lib/utils';

interface CommercialClient {
  id: string;
  companyName: string;
  contactName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  totalBilled: number;
  totalPaid: number;
}

export default function CommercialClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<CommercialClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    address: '',
    notes: '',
  });

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/commercial');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setClients(data);
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/commercial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create client');

      toast.success('Client added successfully');
      setShowModal(false);
      setForm({ companyName: '', contactName: '', phone: '', address: '', notes: '' });
      fetchClients();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add client');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Commercial Clients</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Client
        </button>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          message="No commercial clients added yet. Click Add Client to get started."
          actionLabel="Add Client"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const due = client.totalBilled - client.totalPaid;
            return (
              <div
                key={client.id}
                onClick={() => router.push(`/commercial/${client.id}`)}
                className="card cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.companyName}</h3>
                    {client.contactName && (
                      <p className="text-sm text-gray-500">{client.contactName}</p>
                    )}
                    {client.phone && (
                      <p className="text-sm text-gray-400">{client.phone}</p>
                    )}
                  </div>
                  {!client.isActive && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Billed</p>
                    <p className="text-sm font-semibold text-blue-700">
                      {formatIndianCurrency(client.totalBilled)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Paid</p>
                    <p className="text-sm font-semibold text-green-700">
                      {formatIndianCurrency(client.totalPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Due</p>
                    <p
                      className={`text-sm font-semibold ${
                        due > 0 ? 'text-red-700' : 'text-gray-500'
                      }`}
                    >
                      {formatIndianCurrency(due)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Commercial Client">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="input-field"
              placeholder="Enter company name"
              required
            />
          </div>
          <div>
            <label className="label">Contact Name</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="input-field"
              placeholder="Contact person name"
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="label">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-field"
              placeholder="Address"
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field"
              rows={2}
              placeholder="Additional notes"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
