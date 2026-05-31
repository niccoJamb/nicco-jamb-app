import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Database, Users, Lock, Baby, FileText, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const lastUpdated = 'May 24, 2026';
  const effectiveDate = 'May 24, 2026';
  const contactEmail = 'support.niccojamb@centerkross.com';
  const contactPhone = '+2349030000398';


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
              <p className="text-green-100 mt-1">Nicco JAMB Practice App</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 space-y-8">
          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-b pb-6">
            <div>
              <span className="font-semibold text-gray-900">Effective Date:</span> {effectiveDate}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Last Updated:</span> {lastUpdated}
            </div>
          </div>

          {/* Intro */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Welcome to the <strong>Nicco JAMB Practice App</strong> ("we", "our", or "us"). We are committed to
              protecting your privacy and ensuring that your personal information is handled in a safe and responsible
              manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our mobile application and related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              By using the Nicco JAMB Practice App, you agree to the collection and use of information in accordance
              with this policy. If you do not agree with the terms of this policy, please do not use our Service.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-green-600" />
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-3">We collect the following categories of information:</p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">a) Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Account Information:</strong> Full name, email address, and password when you create an account.</li>
              <li><strong>Profile Data:</strong> Educational level, exam preparation goals, and selected subjects.</li>
              <li><strong>Quiz & Mock Exam Data:</strong> Your answers, scores, time spent, and performance history.</li>
              <li><strong>Contact Information:</strong> Email and messages sent through support or feedback forms.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">b) Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Device Information:</strong> Device model, operating system version, unique device identifiers, and Android version.</li>
              <li><strong>Usage Data:</strong> App features used, session duration, pages viewed, and interaction patterns.</li>
              <li><strong>Log Data:</strong> IP address, access times, and crash reports for diagnostic purposes.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600" />
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To create and manage your account and authenticate logins.</li>
              <li>To deliver and improve the JAMB practice questions, mock exams, and learning experience.</li>
              <li>To track your progress, generate performance analytics, and personalize study recommendations.</li>
              <li>To respond to inquiries, support requests, and feedback.</li>
              <li>To send important service-related notifications and product updates.</li>
              <li>To detect, prevent, and address technical issues, fraud, or abuse.</li>
              <li>To comply with legal obligations and enforce our Terms of Service.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-green-600" />
              3. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-3">
              We rely on trusted third-party services to operate the Nicco JAMB Practice App. These providers have
              access to your information only to perform specific tasks on our behalf and are obligated to protect it:
            </p>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h4 className="font-semibold text-gray-900">Supabase (Database & Authentication)</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Stores account credentials, quiz history, and user profile data securely. Visit{' '}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                    supabase.com/privacy
                  </a>.
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h4 className="font-semibold text-gray-900">Google Play Services</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Used for app distribution, crash reporting, and updates on Android devices.
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h4 className="font-semibold text-gray-900">WhatsApp (Optional Community)</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Used only if you choose to join our community group. We do not share your data with WhatsApp.
                </p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              4. Data Security
            </h2>
            <p className="text-gray-700">
              We implement industry-standard security measures including encrypted connections (HTTPS/TLS), secure
              password hashing, and access controls to protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or
              electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Baby className="w-6 h-6 text-green-600" />
              5. Children's Privacy
            </h2>
            <p className="text-gray-700">
              The Nicco JAMB Practice App is intended for students preparing for the Joint Admissions and Matriculation
              Board (JAMB) examination, which typically includes users aged 13 and above. We do not knowingly collect
              personal information from children under the age of 13 without verifiable parental consent.
            </p>
            <p className="text-gray-700 mt-3">
              If you are a parent or guardian and believe your child has provided us with personal information without
              your consent, please contact us at <a href={`mailto:${contactEmail}`} className="text-green-700 underline font-medium">{contactEmail}</a> and
              we will promptly delete such information from our records.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-green-600" />
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-3">You have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal information.</li>
              <li><strong>Deletion:</strong> Request that we delete your account and associated data.</li>
              <li><strong>Withdraw Consent:</strong> Opt out of marketing communications at any time.</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong>Restrict Processing:</strong> Ask us to limit how we use your information.</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise any of these rights, please email <a href={`mailto:${contactEmail}`} className="text-green-700 underline font-medium">{contactEmail}</a>.
              We will respond within 30 days.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in
              this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When you
              delete your account, we will remove your personal data within 30 days, except where retention is
              required by law.
            </p>
          </section>

          {/* Account & Data Deletion Request */}
          <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
              Account & Data Deletion Request
            </h2>
            <p className="text-gray-700 mb-3">
              Users may request deletion of their account and all associated data by emailing:
            </p>
            <p className="text-gray-700 flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-red-600" />
              <a href={`mailto:${contactEmail}`} className="text-red-700 underline font-semibold">{contactEmail}</a>
            </p>
            <p className="text-gray-700">
              Please include the email address used to create the account. All user data will be
              <strong> permanently deleted within 48 hours</strong>.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700">
              Our app may use local storage and session tokens to keep you logged in and remember your preferences.
              These are essential for the app to function and do not track you across other apps or websites.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be stored and processed on servers located outside Nigeria. By using the Service,
              you consent to such transfer, storage, and processing in countries that may have different data
              protection laws than your country of residence.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated "Last Updated" date. Significant changes will be communicated through the app or via email. We
              encourage you to review this policy periodically.
            </p>
          </section>

          {/* Section 11 - Contact */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-green-600" />
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-3">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Nicco JAMB Practice App</strong></p>
              <p>Email: <a href={`mailto:${contactEmail}`} className="text-green-700 underline font-medium">{contactEmail}</a></p>
              <p>Phone: <a href={`tel:${contactPhone}`} className="text-green-700 underline font-medium">{contactPhone}</a></p>
              <p>Package: com.nicco.jambpractice</p>
            </div>

          </section>

          {/* Footer links */}
          <div className="border-t pt-6 flex flex-wrap gap-4 justify-between items-center text-sm">
            <Link to="/terms" className="text-green-700 hover:underline font-medium">
              View Terms of Service →
            </Link>
            <Link to="/" className="text-gray-600 hover:text-green-700">
              ← Return to App
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Nicco JAMB Practice App. All rights reserved.</p>
          <p className="mt-2">Version 1.0.0 • Made for Nigerian students</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
