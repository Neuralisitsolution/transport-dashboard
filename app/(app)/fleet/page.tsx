'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';

interface Lorry {
  id: string;
  registrationNumber: string;
  driverName: string;
  isActive: boolean;
  createdAt: string;
}

export default function FleetPage() {
  const [lorries, setLorries] = useState<Lorry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLorry, setEditingLorry] = useState<Lorry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [driverName, setDriverName] = useState('');

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [togglingLorry, setTogglingLorry] = useState<Lorry | null>(null);
  const [toggling, setToggling] = useState(false);

  const activeLorryCount = lorries.filter((l) => l.isActive).length;

  const fetchLorries = useCallback(async () => {
    try {
      const res = await fetch('/api/fleet');
      if (!res.ok) throw new Error('Failed to fetch lorries');
      const data = await res.json();
      setLorries(data);
    } catch {
      toast.error('Failed to load lorries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLorries();
  }, [fetchLorries]);

  function openAddModal() {
    setEditingLorry(null);
    setRegistrationNumber('');
    setDriverName('');
    setModalOpen(true);
  }

  function openEditModal(lorry: Lorry) {
    setEditingLorry(lorry);
    setRegistrationNumber(lorry.registrationNumber);
    setDriverName(lorry.driverName);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingLorry(null);
    setRegistrationNumber('');
    setDriverName('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!registrationNumber.trim() || !driverName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = !!editingLorry;
      const res = await fetch('/api/fleet', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit && { id: editingLorry.id, isActive: editingLorry.isActive }),
          registrationNumber: registrationNumber.trim(),
          driverName: driverName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success(isEdit ? 'Lorry updated successfully' : 'Lorry added successfully');
      closeModal();
      await fetchLorries();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function openToggleConfirm(lorry: Lorry) {
    setTogglingLorry(lorry);
    setConfirmOpen(true);
  }

  async function handleToggleActive() {
    if (!togglingLorry) return;

    setToggling(true);
    try {
      const res = await fetch('/api/fleet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: togglingLorry.id,
          registrationNumber: togglingLorry.registrationNumber,
          driverName: togglingLorry.driverName,
          isActive: !togglingLorry.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success(
        togglingLorry.isActive ? 'Lorry deactivated' : 'Lorry activated'
      );
      setConfirmOpen(false);
      setTogglingLorry(null);
      await fetchLorries();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          {lorries.length > 0 && (
            <span className="badge-green text-xs">
              {activeLorryCount} Active
            </span>
          )}
        </div>
        <button onClick={openAddModal} className="btn-primary">
          Add Lorry
        </button>
      </div>

      {/* Content */}
      {lorries.length === 0 ? (
        <div className="card">
          <EmptyState
            message="No lorries added yet. Click Add Lorry to get started."
            actionLabel="Add Lorry"
            onAction={openAddModal}
          />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Registration Number
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Driver Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lorries.map((lorry) => (
                <tr
                  key={lorry.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {lorry.registrationNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {lorry.driverName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={lorry.isActive ? 'badge-green' : 'badge-red'}>
                      {lorry.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(lorry)}
                        className="btn-secondary text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openToggleConfirm(lorry)}
                        className={`text-xs ${lorry.isActive ? 'btn-danger' : 'btn-primary'}`}
                      >
                        {lorry.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingLorry ? 'Edit Lorry' : 'Add Lorry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="registrationNumber" className="label">
              Registration Number
            </label>
            <input
              id="registrationNumber"
              type="text"
              className="input-field"
              placeholder="e.g. MH 12 AB 1234"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="driverName" className="label">
              Driver Name
            </label>
            <input
              id="driverName"
              type="text"
              className="input-field"
              placeholder="e.g. Rajesh Kumar"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingLorry
                  ? 'Update Lorry'
                  : 'Add Lorry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivate/Activate Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setTogglingLorry(null);
        }}
        onConfirm={handleToggleActive}
        title={togglingLorry?.isActive ? 'Deactivate Lorry' : 'Activate Lorry'}
        message={
          togglingLorry?.isActive
            ? `Are you sure you want to deactivate ${togglingLorry?.registrationNumber}? It will no longer appear in active fleet.`
            : `Are you sure you want to activate ${togglingLorry?.registrationNumber}?`
        }
        confirmText={togglingLorry?.isActive ? 'Yes, deactivate' : 'Yes, activate'}
        loading={toggling}
      />
    </div>
  );
}
