'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { formatIndianCurrency } from '@/lib/utils';

interface Crusher {
  id: string;
  name: string;
  contactName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  totalCredit: number;
  totalPaid: number;
  balance: number;
}

export default function CrushersPage() {
  const [crushers, setCrushers] = useState<Crusher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    address: '',
    notes: '',
  });

  const fetchCrushers = async () => {
    try {
      const res = await fetch('/api/crushers');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCrushers(data);
    } catch {
      toast.error('Failed to load crushers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrushers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Crusher name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/crushers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create crusher');
      }

      toast.success('Crusher added successfully');
      setShowModal(false);
      setForm({ name: '', contactName: '', phone: '', address: '', notes: '' });
      fetchCrushers();
    } catch (error: any) {
      toast.error(error.message);
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
        <h1 className="text-2xl font-bold text-gray-900">Crushers</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Crusher
        </button>
      </div>

      {crushers.length === 0 ? (
        <EmptyState
          message="No crushers added yet. Click Add Crusher to get started."
          actionLabel="Add Crusher"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crushers.map((crusher) => (
            <Link key={crusher.id} href={`/crushers/${crusher.id}`}>
              <div className="card hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 text-lg">{crusher.name}</h3>
                {(crusher.contactName || crusher.phone) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {crusher.contactName}
                    {crusher.contactName && crusher.phone && ' \u2022 '}
                    {crusher.phone}
                  </p>
                )}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total Credit Taken</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatIndianCurrency(crusher.totalCredit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total Paid</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatIndianCurrency(crusher.totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Balance Due</span>
                    <span
                      className={`text-sm font-bold ${
                        crusher.balance > 0 ? 'text-amber-600' : 'text-gray-500'
                      }`}
                    >
                      {formatIndianCurrency(crusher.balance)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Crusher">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Crusher name"
              required
            />
          </div>
          <div>
            <label className="label">Contact Name</label>
            <input
              type="text"
              className="input-field"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="Contact person name"
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="label">Address</label>
            <input
              type="text"
              className="input-field"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input-field"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Crusher'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
