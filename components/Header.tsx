'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/jobs', label: 'All Jobs' },
  { href: '/category/central-govt', label: 'Central Govt' },
  { href: '/category/banking', label: 'Banking' },
  { href: '/category/state-govt', label: 'State Govt' },
  { href: '/category/defence', label: 'Defence' },
  { href: '/category/teaching', label: 'Teaching' },
  { href: '/calendar', label: 'Exam Calendar' },
  { href: '/results', label: 'Results' },
  { href: '/admit-cards', label: 'Admit Cards' },
];

const toolLinks = [
  { href: '/tools/salary-calculator', label: 'Salary Calculator' },
  { href: '/tools/age-calculator', label: 'Age Calculator' },
  { href: '/preparation', label: 'Preparation' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">NaukriAlert</span>
              <span className="ml-1 rounded bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700">AI</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary-600"
              >
                Tools
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {toolsOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setToolsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/profile" className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block">
              My Profile
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t py-4 lg:hidden">
            <div className="space-y-1">
              {[...navLinks, ...toolLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/profile"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
