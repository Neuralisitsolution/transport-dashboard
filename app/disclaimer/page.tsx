import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Disclaimer',
  'Read the NaukriAlert AI disclaimer. Important information about the accuracy and nature of government job listings on our platform.',
  '/disclaimer'
);

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="section-title">Disclaimer</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: March 29, 2026</p>

      {/* Important Notice */}
      <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-5">
        <h2 className="font-bold text-orange-900">Important Notice</h2>
        <p className="mt-2 text-sm text-orange-800">
          NaukriAlert AI is <strong>not</strong> an official government website. We are a private
          platform that aggregates publicly available government job information for the convenience
          of job aspirants. Always verify information from official sources before taking any action.
        </p>
      </div>

      <div className="mt-8 space-y-8 text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900">1. Nature of Information</h2>
          <p className="mt-2">
            The job notifications, exam dates, eligibility criteria, salary details, age limits,
            application fees, and other information published on NaukriAlert AI are collected from
            official government websites, employment newspapers, and public notifications. This
            information is provided for general informational and educational purposes only.
          </p>
          <p className="mt-2">
            We make every effort to keep the information accurate and up-to-date. However, the
            information on this website may contain errors, inaccuracies, or may become outdated
            due to changes made by the issuing organizations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. No Official Affiliation</h2>
          <p className="mt-2">
            NaukriAlert AI has no affiliation, association, or partnership with any government body,
            public sector undertaking, recruitment board, or commission. Organization names, logos,
            and other identifiers are used solely for the purpose of identifying job notifications
            and are the property of their respective owners.
          </p>
          <p className="mt-2">
            References to organizations such as SSC, UPSC, IBPS, SBI, RBI, Railway Recruitment
            Boards, State PSCs, Indian Army, Navy, Air Force, KVS, NVS, and others are for
            informational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. Accuracy of Job Information</h2>
          <p className="mt-2">
            While we use AI-powered systems to scan and verify job notifications, we cannot guarantee:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>The accuracy or completeness of any job listing</li>
            <li>That all available government jobs are listed on our platform</li>
            <li>That dates, vacancy counts, or eligibility criteria are current</li>
            <li>That application links or official URLs are active or correct</li>
            <li>That salary figures or fee structures are up to date</li>
          </ul>
          <p className="mt-2 font-semibold text-gray-800">
            Users must always verify all details from the official notification or gazette before
            applying for any position.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Eligibility Matching</h2>
          <p className="mt-2">
            Our AI-powered eligibility matching is provided as a helpful tool and should not be
            considered definitive. The matching is based on the profile information you provide and
            the job criteria we have extracted from notifications. There may be additional eligibility
            requirements not captured by our system.
          </p>
          <p className="mt-2">
            Being shown as &quot;eligible&quot; on NaukriAlert AI does not guarantee that you meet
            all official eligibility criteria for a position. Always read the full official
            notification carefully.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Application Process</h2>
          <p className="mt-2">
            NaukriAlert AI does not process job applications. We provide links to official
            application portals. We are not responsible for:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Technical issues on official application portals</li>
            <li>Application fees paid to government organizations</li>
            <li>Rejection of applications for any reason</li>
            <li>Changes in application deadlines or procedures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Alert Delivery</h2>
          <p className="mt-2">
            While we strive to deliver job alerts promptly via email and Telegram, we cannot
            guarantee:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Timely delivery of all alerts (email may be delayed or filtered as spam)</li>
            <li>That all relevant jobs will be included in alerts</li>
            <li>Uninterrupted service availability</li>
          </ul>
          <p className="mt-2">
            Users should not rely solely on our alerts and should regularly check official sources
            for new notifications.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">7. External Links</h2>
          <p className="mt-2">
            Our website contains links to official government websites and other third-party
            resources. We do not control the content of these external websites and are not
            responsible for their availability, accuracy, or content. Following external links
            is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">8. No Guarantee of Employment</h2>
          <p className="mt-2">
            Using NaukriAlert AI does not guarantee employment or selection in any government
            position. Selection is solely determined by the respective recruiting organizations
            based on their criteria, examination performance, and other factors.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">9. Limitation of Liability</h2>
          <p className="mt-2">
            NaukriAlert AI shall not be held liable for any loss, damage, or inconvenience caused
            by reliance on information published on this platform. This includes but is not limited
            to missed application deadlines, incorrect eligibility assessments, financial losses from
            application fees, or any consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">10. Beware of Fraud</h2>
          <p className="mt-2">
            Government jobs in India are filled through a transparent recruitment process.
          </p>
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">
              No legitimate government job requires payment for guaranteed selection. If anyone
              contacts you claiming to offer a government job in exchange for money, it is a scam.
              Report such incidents to the police immediately.
            </p>
          </div>
          <p className="mt-3">
            NaukriAlert AI will never ask you for payment in exchange for job placement or selection
            assistance. Our service is and will always remain free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">11. Changes to This Disclaimer</h2>
          <p className="mt-2">
            We reserve the right to update this Disclaimer at any time. Changes will be reflected
            on this page with an updated date. We encourage users to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">12. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about this Disclaimer, please contact us:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Email:{' '}
              <a href="mailto:support@naukrialert.ai" className="font-medium text-primary-600 hover:text-primary-700">
                support@naukrialert.ai
              </a>
            </li>
            <li>
              Contact page:{' '}
              <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-700">
                Contact Us
              </Link>
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
            <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-700">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
