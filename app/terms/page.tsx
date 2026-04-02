import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Terms of Service',
  'Read the NaukriAlert AI terms of service. Understand the rules and guidelines for using our government job alert platform.',
  '/terms'
);

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="section-title">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: March 29, 2026</p>

      <div className="mt-8 space-y-8 text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing and using NaukriAlert AI (&quot;the Service&quot;), you agree to be bound
            by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please
            do not use the Service. We reserve the right to modify these Terms at any time, and your
            continued use of the Service constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Description of Service</h2>
          <p className="mt-2">
            NaukriAlert AI is a free, AI-powered platform that aggregates government job
            notifications from official sources across India. The Service includes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Government job listings from Central, State, Banking, Defence, and Teaching sectors</li>
            <li>AI-powered eligibility matching based on user profiles</li>
            <li>Email and Telegram job alert notifications</li>
            <li>Exam calendar, admit card updates, and result notifications</li>
            <li>Free tools such as salary calculator and age calculator</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. User Accounts and Profiles</h2>
          <p className="mt-2">
            To use certain features of the Service, you may create a user profile. You agree to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Not create profiles for any fraudulent or unauthorized purpose</li>
            <li>Not share your account access with others</li>
          </ul>
          <p className="mt-2">
            We reserve the right to suspend or terminate accounts that violate these Terms or contain
            false information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Acceptable Use</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Use the Service for any unlawful purpose</li>
            <li>Scrape, crawl, or use automated tools to extract data from the Service without permission</li>
            <li>Interfere with, disrupt, or overload the Service or its servers</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Reproduce, duplicate, or redistribute the Service content for commercial purposes</li>
            <li>Upload or transmit viruses, malware, or any harmful code</li>
            <li>Impersonate another person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Intellectual Property</h2>
          <p className="mt-2">
            All content on NaukriAlert AI, including but not limited to text, graphics, logos, icons,
            software, and design, is the property of NaukriAlert AI or its content suppliers and is
            protected by Indian and international copyright laws.
          </p>
          <p className="mt-2">
            Government job notification content is sourced from official public sources and is
            presented for informational purposes. Original organization and presentation of this
            content is our intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Job Information Accuracy</h2>
          <p className="mt-2">
            While we strive to provide accurate and up-to-date job information, NaukriAlert AI:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Does not guarantee the accuracy, completeness, or timeliness of any job listing</li>
            <li>Is not an official government website or recruitment portal</li>
            <li>Does not have any affiliation with government organizations listed on the platform</li>
            <li>Recommends that users verify all information from official sources before applying</li>
          </ul>
          <p className="mt-2">
            Users should always refer to official notification PDFs and government websites for
            confirmed details regarding eligibility, dates, and application procedures.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">7. Email and Telegram Alerts</h2>
          <p className="mt-2">
            By subscribing to our email or Telegram alerts, you consent to receive job notifications
            based on your preferences. You can unsubscribe at any time by:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Clicking the unsubscribe link in any email alert</li>
            <li>Leaving the Telegram channel or group</li>
            <li>Contacting us at support@naukrialert.ai</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">8. Third-Party Links</h2>
          <p className="mt-2">
            The Service may contain links to third-party websites, including official government
            portals. These links are provided for convenience only. We do not endorse, control, or
            assume responsibility for the content or practices of any third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">9. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, NaukriAlert AI and its team shall not be liable
            for any direct, indirect, incidental, special, consequential, or punitive damages arising
            from:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Your use of or inability to use the Service</li>
            <li>Any errors, inaccuracies, or omissions in job listings</li>
            <li>Missed deadlines or opportunities due to delayed or inaccurate alerts</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Any other matter relating to the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">10. Indemnification</h2>
          <p className="mt-2">
            You agree to indemnify and hold harmless NaukriAlert AI, its team, and affiliates from
            any claims, losses, liabilities, damages, costs, or expenses arising from your use of
            the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">11. Termination</h2>
          <p className="mt-2">
            We may terminate or suspend your access to the Service at our sole discretion, without
            prior notice, for conduct that we believe violates these Terms or is harmful to other
            users or the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">12. Governing Law</h2>
          <p className="mt-2">
            These Terms shall be governed by and construed in accordance with the laws of India.
            Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
            of the courts in Noida, Uttar Pradesh, India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">13. Contact Information</h2>
          <p className="mt-2">
            For questions about these Terms of Service, please contact us:
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
            See also our{' '}
            <Link href="/privacy-policy" className="font-medium text-primary-600 hover:text-primary-700">
              Privacy Policy
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
