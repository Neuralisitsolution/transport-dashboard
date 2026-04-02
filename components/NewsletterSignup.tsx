'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-700 p-8 text-white">
      <h3 className="text-xl font-bold">Never Miss a Government Job</h3>
      <p className="mt-2 text-sm text-white/80">
        Get daily job alerts delivered to your inbox. Join 50,000+ aspirants.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/60 backdrop-blur-sm transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-gray-100 disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-2 text-sm text-green-300">Subscribed successfully! Check your inbox.</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-300">Failed to subscribe. Please try again.</p>
      )}
    </div>
  );
}
