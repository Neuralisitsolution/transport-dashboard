import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Privacy Policy',
  'Read the NaukriAlert AI privacy policy. Learn how we collect, use, and protect your personal information.',
  '/privacy-policy'
);

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="section-title">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: March 29, 2026</p>

      <div className="mt-8 space-y-8 text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900">1. Introduction</h2>
          <p className="mt-2">
            NaukriAlert AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
            the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website and use our services, including job
            alerts via email and Telegram.
          </p>
          <p className="mt-2">
            By using NaukriAlert AI, you agree to the collection and use of information in accordance
            with this policy. If you do not agree, please discontinue use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Information We Collect</h2>
          <h3 className="mt-3 font-semibold text-gray-800">2.1 Personal Information</h3>
          <p className="mt-2">When you create a profile or subscribe to alerts, we may collect:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Full name</li>
            <li>Email address</li>
            <li>Date of birth (for age-based eligibility matching)</li>
            <li>Education level</li>
            <li>Reservation category (General, OBC, SC, ST, EWS, PwD)</li>
            <li>State of residence</li>
            <li>Job category and location preferences</li>
            <li>Salary expectations</li>
          </ul>

          <h3 className="mt-4 font-semibold text-gray-800">2.2 Automatically Collected Information</h3>
          <p className="mt-2">When you visit our website, we may automatically collect:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited, time spent, and referring URLs</li>
            <li>Device information (mobile or desktop)</li>
          </ul>

          <h3 className="mt-4 font-semibold text-gray-800">2.3 Cookies</h3>
          <p className="mt-2">
            We use cookies and similar tracking technologies to enhance your experience. You can
            control cookies through your browser settings. Disabling cookies may limit some features
            of the website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. How We Use Your Information</h2>
          <p className="mt-2">We use the collected information to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Match you with eligible government job opportunities based on your profile</li>
            <li>Send job alerts via email and Telegram</li>
            <li>Improve our website, features, and AI matching algorithms</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Information Sharing</h2>
          <p className="mt-2">
            We do <strong>not</strong> sell, rent, or trade your personal information to third parties.
            We may share information in the following limited circumstances:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong>Service providers:</strong> Third-party services that help us operate the
              platform (e.g., email delivery, hosting, analytics). These providers are contractually
              obligated to protect your data.
            </li>
            <li>
              <strong>Legal requirements:</strong> When required by law, regulation, or legal process.
            </li>
            <li>
              <strong>Protection of rights:</strong> To protect the safety, rights, or property of
              NaukriAlert AI, our users, or the public.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Data Security</h2>
          <p className="mt-2">
            We implement industry-standard security measures to protect your personal information,
            including encryption, secure servers, and access controls. However, no method of
            transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Data Retention</h2>
          <p className="mt-2">
            We retain your personal information for as long as your account is active or as needed
            to provide you services. You can request deletion of your data at any time by contacting
            us at{' '}
            <a href="mailto:support@naukrialert.ai" className="font-medium text-primary-600 hover:text-primary-700">
              support@naukrialert.ai
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">7. Your Rights</h2>
          <p className="mt-2">You have the right to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of email and Telegram alerts at any time</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:support@naukrialert.ai" className="font-medium text-primary-600 hover:text-primary-700">
              support@naukrialert.ai
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">8. Third-Party Links</h2>
          <p className="mt-2">
            Our website may contain links to official government websites and other third-party
            sites. We are not responsible for the privacy practices of these external sites. We
            encourage you to read their privacy policies before providing any personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">9. Children&apos;s Privacy</h2>
          <p className="mt-2">
            NaukriAlert AI is not intended for children under the age of 16. We do not knowingly
            collect personal information from children. If you believe we have collected information
            from a minor, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">10. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated &quot;Last updated&quot; date. Your continued use of the service after
            changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">11. Contact Us</h2>
          <p className="mt-2">
            If you have any questions or concerns about this Privacy Policy, please contact us:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Email:{' '}
              <a href="mailto:support@naukrialert.ai" className="font-medium text-primary-600 hover:text-primary-700">
                support@naukrialert.ai
              </a>
            </li>
            <li>
              Address: NaukriAlert AI, 123, Tech Park, Sector 62, Noida, Uttar Pradesh 201301, India
            </li>
          </ul>
        </section>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            By using NaukriAlert AI, you acknowledge that you have read, understood, and agree to
            this Privacy Policy. For more information, visit our{' '}
            <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/disclaimer" className="font-medium text-primary-600 hover:text-primary-700">
              Disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
