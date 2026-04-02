import Link from 'next/link';

const footerLinks = {
  'Job Categories': [
    { href: '/category/central-govt', label: 'Central Government' },
    { href: '/category/banking', label: 'Banking & Insurance' },
    { href: '/category/state-govt', label: 'State Government' },
    { href: '/category/defence', label: 'Defence Jobs' },
    { href: '/category/teaching', label: 'Teaching Jobs' },
  ],
  'Popular Exams': [
    { href: '/exam/ssc-cgl', label: 'SSC CGL' },
    { href: '/exam/upsc-ias', label: 'UPSC IAS' },
    { href: '/exam/ibps-po', label: 'IBPS PO' },
    { href: '/exam/rrb-ntpc', label: 'RRB NTPC' },
    { href: '/exam/sbi-po', label: 'SBI PO' },
  ],
  'Tools': [
    { href: '/tools/salary-calculator', label: 'Salary Calculator' },
    { href: '/tools/age-calculator', label: 'Age Calculator' },
    { href: '/calendar', label: 'Exam Calendar' },
    { href: '/admit-cards', label: 'Admit Cards' },
    { href: '/results', label: 'Results' },
  ],
  'Quick Links': [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">NaukriAlert</span>
                <span className="ml-1 rounded bg-primary-600 px-1.5 py-0.5 text-xs font-semibold text-white">AI</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              India&apos;s most comprehensive AI-powered government job alert platform.
              Never miss a sarkari naukri opportunity.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://t.me/NaukriAlertAI" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-800 p-2 transition hover:bg-gray-700">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} NaukriAlert AI. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Disclaimer: NaukriAlert AI is a job information aggregator. Always verify details from official sources before applying.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
