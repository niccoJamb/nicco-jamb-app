import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, AlertTriangle, Scale, Ban, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
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
              Welcome to the <strong>Nicco JAMB Practice App</strong>. These Terms of Service ("Terms") govern your
              access to and use of the Nicco JAMB Practice App and related services (collectively, the "Service")
              operated by Nicco ("we", "us", or "our").
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              By downloading, accessing, or using the Service, you agree to be bound by these Terms. If you do not
              agree to these Terms, do not use the Service.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By creating an account or using the Nicco JAMB Practice App, you confirm that you are at least 13 years
              old (or have parental/guardian consent if younger), and you agree to comply with these Terms and our{' '}
              <Link to="/privacy" className="text-green-700 underline font-medium">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-3">
              The Nicco JAMB Practice App provides an educational platform designed to help Nigerian students prepare
              for the Joint Admissions and Matriculation Board (JAMB) Unified Tertiary Matriculation Examination
              (UTME). Features include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Subject-based practice quizzes</li>
              <li>Timed mock examinations</li>
              <li>Past JAMB question banks</li>
              <li>Performance tracking and analytics</li>
              <li>Study materials and explanations</li>
              <li>Community access via WhatsApp groups (optional)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-3">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information.</li>
              <li>Maintain the security of your password and account.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Accept responsibility for all activities under your account.</li>
              <li>Not share your account credentials with others.</li>
            </ul>
            <p className="text-gray-700 mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Ban className="w-6 h-6 text-green-600" />
              4. Acceptable Use
            </h2>
            <p className="text-gray-700 mb-3">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use the Service for any unlawful, fraudulent, or harmful purpose.</li>
              <li>Copy, distribute, or sell content from the app without our permission.</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code.</li>
              <li>Use bots, scrapers, or automated tools to access the Service.</li>
              <li>Upload viruses, malware, or any malicious code.</li>
              <li>Impersonate any person or misrepresent your identity.</li>
              <li>Interfere with or disrupt the Service or its servers.</li>
              <li>Cheat, share answers during mock exams, or engage in academic dishonesty.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700">
              All content, features, and functionality of the Nicco JAMB Practice App — including questions,
              explanations, designs, logos, text, graphics, and software — are the exclusive property of Nicco and
              are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mt-3">
              You are granted a limited, non-exclusive, non-transferable license to use the Service for personal,
              non-commercial educational purposes only.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. JAMB Content Disclaimer</h2>
            <p className="text-gray-700">
              The Nicco JAMB Practice App is an independent study tool and is <strong>not affiliated with, endorsed by,
              or sponsored by</strong> the Joint Admissions and Matriculation Board (JAMB). Past questions are used for
              educational purposes only. While we strive to provide accurate content, we do not guarantee that using
              this app will result in specific exam scores or admission outcomes.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User-Generated Content</h2>
            <p className="text-gray-700">
              If you submit feedback, comments, or suggestions, you grant us a worldwide, royalty-free, perpetual
              license to use, modify, and incorporate that content into our Service without compensation to you.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-green-600" />
              8. Disclaimers
            </h2>
            <p className="text-gray-700">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either
              express or implied. We do not warrant that the Service will be uninterrupted, error-free, secure, or
              free of viruses or other harmful components.
            </p>
            <p className="text-gray-700 mt-3">
              We make no guarantees regarding exam results, JAMB scores, or university admission based on use of this
              app. Success depends on individual effort, study habits, and many factors beyond our control.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-green-600" />
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, Nicco and its affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill
              — arising from your use of or inability to use the Service.
            </p>
            <p className="text-gray-700 mt-3">
              Our total liability for any claim arising from these Terms shall not exceed the amount you paid us in
              the 12 months preceding the claim, or NGN 5,000, whichever is greater.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless Nicco, its affiliates, and employees from any claims, damages,
              losses, or expenses (including legal fees) arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700">
              We may suspend or terminate your access to the Service at any time, with or without notice, for any
              reason — including breach of these Terms. Upon termination, your right to use the Service will cease
              immediately. You may also delete your account at any time by contacting us.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to its conflict
              of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts
              of Nigeria.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
              13. Changes to These Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an
              updated "Last Updated" date. Continued use of the Service after changes are posted constitutes your
              acceptance of the new Terms.
            </p>
          </section>

          {/* Section 14 - Contact */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-green-600" />
              14. Contact Us
            </h2>
            <p className="text-gray-700 mb-3">
              If you have any questions about these Terms of Service, please contact us at:
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
            <Link to="/privacy" className="text-green-700 hover:underline font-medium">
              View Privacy Policy →
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

export default Terms;
