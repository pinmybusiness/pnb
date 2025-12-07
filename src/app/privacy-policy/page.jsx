// app/privacy-policy/page.jsx
import { Shield, Mail, MapPin, Check, FileText, AlertCircle } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy - FasterQ",
  description: "Read the privacy policy for FasterQ, including data usage, storage, and user rights.",
};

export default function PrivacyPolicyPage() {
  const tableOfContents = [
    "What Information Do We Collect?",
    "How Do We Use Your Information?",
    "Will Your Information Be Shared With Anyone?",
    "Do We Use Cookies or Tracking Technologies?",
    "Do We Use Google Services?",
    "Is Your Information Transferred Internationally?",
    "How Long Do We Keep Your Information?",
    "How Do We Keep Your Information Safe?",
    "Do We Collect Information From Minors?",
    "Data Protection Contact",
    "Your Privacy Rights",
    "How We Manage User Consent",
    "California Privacy Rights",
    "Updates to This Policy",
    "Is Your Data Secure?",
    "Data Breach Policy",
    "How to Contact Us"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
              <p className="text-white/90 mt-2">Last Updated: 5th Dec 2025</p>
            </div>
          </div>
          <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information at FasterQ.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Introduction Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-12 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Welcome to FasterQ</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Thank you for choosing FasterQ. We are committed to protecting your personal information and your right to privacy. 
                If you have any questions or concerns about this privacy policy or our practices, contact us at{' '}
                <a href="mailto:info@fasterq.in" className="text-[#FF5211] font-semibold hover:underline">
                  info@fasterq.in
                </a>
              </p>
              
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-sm font-semibold text-gray-900 mb-2">This Privacy Policy applies to:</p>
                <ul className="space-y-1.5">
                  {['FasterQ Mobile App (Android/iOS)', 'FasterQ Web Dashboard', 'www.fasterq.in website', 'Any related services, features, marketing, or events'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#FF5211] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Table of Contents
          </h2>
          <ol className="space-y-3">
            {tableOfContents.map((item, index) => (
              <li key={index} className="group">
                <a 
                  href={`#section-${index + 1}`}
                  className="flex items-start gap-3 text-gray-700 hover:text-[#FF5211] transition-colors duration-200 p-3 rounded-xl hover:bg-orange-50"
                >
                  <span className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center text-sm font-bold text-[#FF5211] flex-shrink-0 transition-colors">
                    {index + 1}
                  </span>
                  <span className="font-medium pt-1">{item}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1 */}
        <section id="section-1" className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">1</span>
            What Information Do We Collect?
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF5211] rounded-full"></div>
                A. Personal Information You Provide
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We collect personal details such as your name, phone number, email address, password, company name (optional), device info, and support messages. You must ensure this information is accurate and up-to-date.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF5211] rounded-full"></div>
                B. Information Automatically Collected
              </h3>
              <p className="text-gray-700 leading-relaxed">
                When you use FasterQ, we automatically collect usage and technical data such as IP address, device model, OS, crash logs, browser type, and interaction analytics.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF5211] rounded-full"></div>
                C. Information Collected Through the FasterQ App
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">With your explicit permission, FasterQ may collect:</p>
              <ul className="space-y-2">
                {['Call logs & call history', 'Call recordings (non–Google Dialer only)', 'Spam detection & unknown number analytics', 'Contact syncing for caller identification', 'Cloud backups of call logs, notes, and recordings (if enabled)', 'AI insights for call behavior patterns', 'Data for multi-device login synchronization'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF5211] rounded-full"></div>
                D. Information From Third Parties
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may receive limited information from marketing partners, public databases, or social platforms (if login integrations are added later).
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">2</span>
            How Do We Use Your Information?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
          <ul className="space-y-2">
            {['Provide core features like call tracking & analytics', 'Sync logs, contacts, and recordings across devices', 'Improve performance using AI insights', 'Send service updates and notifications', 'Detect fraud, spam, and suspicious activity', 'Offer cloud backup & multi-device continuity', 'Deliver personalized insights and dashboards'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#FF5211] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">3</span>
            Will Your Information Be Shared With Anyone?
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <p className="text-green-900 font-semibold flex items-center gap-2">
              <Check className="w-5 h-5" />
              FasterQ does not sell user data
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">We only share information when required for:</p>
          <ul className="space-y-2">
            {['Legal compliance', 'Cloud hosting (AWS)', 'Service providers (analytics, support)', 'Fraud and safety monitoring', 'Business transfer situations (merger/acquisition)'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sections 4-9 (Compact) */}
        {[
          { num: 4, title: "Do We Use Cookies and Tracking Technologies?", content: "Yes, FasterQ uses cookies, tracking pixels, and analytics SDKs for improving user experience and app performance." },
          { num: 5, title: "Do We Use Google Services?", content: "FasterQ may use Google APIs for analytics, crash reporting, or mapping functionalities. Usage complies with Google API User Data Policies." },
          { num: 6, title: "Is Your Information Transferred Internationally?", content: "Your data is stored on AWS EC2 + MongoDB in the Mumbai (India) region. Users outside India acknowledge their data will be processed in India." },
          { num: 7, title: "How Long Do We Keep Your Information?", content: "We retain your data as long as your account remains active, and up to 1 year post-account termination unless legal requirements demand otherwise." },
          { num: 8, title: "How Do We Keep Your Information Safe?", content: "We use SSL/HTTPS encryption, firewalls, secured servers, and strict internal access controls. Although we take strong measures, no digital system is 100% secure." },
          { num: 9, title: "Do We Collect Information From Minors?", content: "No, FasterQ does not knowingly collect data from anyone under 18 years. Accounts found belonging to minors will be deleted." }
        ].map((section) => (
          <section key={section.num} id={`section-${section.num}`} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">{section.num}</span>
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </section>
        ))}

        {/* Section 10 - Contact */}
        <section id="section-10" className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-8 mb-8 shadow-lg scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">10</span>
            Data Protection Contact
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a href="mailto:info@fasterq.in" className="text-blue-600 font-semibold hover:underline">
                info@fasterq.in
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Bengaluru, India</span>
            </div>
          </div>
        </section>

        {/* Section 11 - Privacy Rights */}
        <section id="section-11" className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">11</span>
            What Are Your Privacy Rights?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">You may request:</p>
          <ul className="space-y-2">
            {['Access to your data', 'Correction', 'Deletion', 'Restriction of processing', 'Data portability'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#FF5211] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Remaining Sections (12-17) */}
        {[
          { num: 12, title: "How We Manage User Consent", content: "Users can control app permissions, adjust consent settings, or delete their accounts to withdraw consent completely." },
          { num: 13, title: "California Privacy Rights (CCPA)", content: "California users may request data disclosures or deletion of publicly posted content as required under CCPA." },
          { num: 14, title: "Do We Make Updates to This Policy?", content: "Yes, this policy may be updated as necessary. The revised date indicates the latest version." },
          { num: 15, title: "Is Your Data Secure?", content: "FasterQ uses AWS EC2, MongoDB, firewalls, and secure encryption layers to protect user data." }
        ].map((section) => (
          <section key={section.num} id={`section-${section.num}`} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">{section.num}</span>
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </section>
        ))}

        {/* Section 16 - Data Breach */}
        <section id="section-16" className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white">
              <AlertCircle className="w-5 h-5" />
            </span>
            Data Breach Policy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">In the event of a breach, FasterQ will:</p>
          <ul className="space-y-2">
            {['Activate an internal response team', 'Restrict compromised system access', 'Investigate root causes', 'Notify affected users if high risk', 'Document and prevent recurrence'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 17 - Final Contact */}
        <section id="section-17" className="bg-gradient-to-br from-[#FF5211] to-orange-600 text-white rounded-2xl p-8 shadow-2xl shadow-orange-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold">17</span>
            How Can You Contact Us?
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <a href="mailto:info@fasterq.in" className="font-semibold hover:underline">
                info@fasterq.in
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span>Bengaluru, India</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}