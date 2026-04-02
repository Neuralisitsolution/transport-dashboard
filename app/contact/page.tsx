import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = generatePageMetadata(
  'Contact Us',
  'Get in touch with NaukriAlert AI. Reach us for queries about government job alerts, partnerships, or feedback.',
  '/contact'
);

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Have a question, suggestion, or partnership inquiry? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="mt-2 text-sm text-gray-600">For general inquiries and support</p>
              <a
                href="mailto:support@naukrialert.ai"
                className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                support@naukrialert.ai
              </a>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900">Phone</h3>
              <p className="mt-2 text-sm text-gray-600">Monday to Saturday, 9 AM - 6 PM IST</p>
              <a
                href="tel:+911234567890"
                className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                +91 12345 67890
              </a>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900">Office Address</h3>
              <p className="mt-2 text-sm text-gray-600">
                NaukriAlert AI
                <br />
                123, Tech Park, Sector 62
                <br />
                Noida, Uttar Pradesh 201301
                <br />
                India
              </p>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900">Follow Us</h3>
              <p className="mt-2 text-sm text-gray-600">
                Stay connected for the latest updates and job alerts.
              </p>
              <div className="mt-3 flex gap-3">
                <a
                  href="#"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-primary-300 hover:text-primary-600"
                >
                  Telegram
                </a>
                <a
                  href="#"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-primary-300 hover:text-primary-600"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-primary-300 hover:text-primary-600"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your full name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select id="contact-subject" className="input-field">
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="job-info">Job Information Query</option>
                    <option value="bug">Report a Bug / Issue</option>
                    <option value="partnership">Partnership / Collaboration</option>
                    <option value="feedback">Feedback / Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number (optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Write your message here..."
                    className="input-field"
                  />
                </div>

                <button type="button" className="btn-primary">
                  Send Message
                </button>
                <p className="text-xs text-gray-500">
                  This form is for demonstration purposes. For real inquiries, please email us directly.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: 'Is NaukriAlert AI free to use?',
                a: 'Yes, NaukriAlert AI is completely free. You can browse jobs, create a profile, and receive email and Telegram alerts at no cost.',
              },
              {
                q: 'How often are jobs updated?',
                a: 'Our AI engine scans official sources every 2 hours to ensure you get the latest notifications as quickly as possible.',
              },
              {
                q: 'Can I get alerts for a specific state or category?',
                a: 'Absolutely. Create a profile and select your preferred states and job categories. You will only receive alerts that match your preferences.',
              },
              {
                q: 'How do I report incorrect job information?',
                a: 'If you find any inaccuracies, please reach out to us via the contact form above or email support@naukrialert.ai. We take accuracy very seriously.',
              },
            ].map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-bold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
