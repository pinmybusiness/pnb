// app/terms/page.jsx
import { FileText, Shield, AlertTriangle, Lock, Check, Mail, MapPin, Copyright, Scale } from 'lucide-react';

export const metadata = {
  title: "Terms & Conditions - FasterQ",
  description: "Read the official Terms & Conditions for using FasterQ services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Terms & Conditions</h1>
              <p className="text-white/90 mt-2">Effective Date: December 2025</p>
            </div>
          </div>
          <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
            Please read these terms carefully before using FasterQ. By accessing our services, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Introduction Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-12 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Important Notice</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please read these Terms and Conditions carefully before using the FasterQ App or any related services. By accessing or using FasterQ, you agree to be bound by these Terms. If you do not agree, you should not use the application.
              </p>
              
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  Throughout these Terms, the words <strong>"We", "Us", "Our", "Company"</strong> refer to FasterQ.
                  The terms <strong>"You", "User", "Buyer", "Visitor"</strong> refer to any individual or entity accessing or using FasterQ services.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-700">
                  FasterQ reserves the right to modify or update these Terms at any time. Updated versions will be posted on our website at{' '}
                  <a href="https://www.fasterq.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                    www.fasterq.in
                  </a>. Continued use after such updates constitutes acceptance of the revised Terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 - Use of Content */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">1</span>
            Use of Content
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              All trademarks, logos, names, content, UI components, analytics dashboards, and graphical elements within the FasterQ App or website are the exclusive property of the Company. You may not copy, reproduce, distribute, or modify any content without obtaining written permission from FasterQ.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Warning: Unauthorized Usage
              </p>
              <p className="text-sm text-red-800 mt-2">
                Unauthorized usage, duplication, or commercial exploitation of FasterQ materials may result in legal action and termination of your account.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 - Acceptable Use */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">2</span>
            Acceptable Use Policy
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FF5211]" />
                A) Security Rules
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Users must NOT engage in activities that compromise or attempt to compromise FasterQ systems or data, including:
              </p>
              <ul className="space-y-2">
                {[
                  'Accessing accounts or servers not assigned to you',
                  'Attempting to bypass authentication or security controls',
                  'Uploading or distributing viruses, malware, or harmful scripts',
                  'Performing unauthorized scanning, probing, or load testing',
                  'Sending unsolicited emails or spam using FasterQ systems'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">✕</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-900">
                  <strong>Consequences:</strong> Any such violations may lead to account suspension, permanent removal, and legal proceedings.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF5211]" />
                B) General Usage Rules
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree NOT to use FasterQ to transmit or store content that:
              </p>
              <ul className="space-y-2">
                {[
                  'Violates any law or regulation',
                  'Infringes upon copyrights or trademarks',
                  'Contains abusive, obscene, defamatory, or harmful material',
                  'Unlawfully invades the privacy of others'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">✕</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 - Indemnity */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">3</span>
            Indemnity
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree to indemnify and hold harmless FasterQ, its officers, employees, partners, and affiliates from any claims, damages, losses, liabilities, or legal fees arising from:
          </p>
          <ul className="space-y-2">
            {[
              'Your misuse of the FasterQ App',
              'Your violation of these Terms',
              'Your breach of applicable laws or regulations'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 - Liability */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">4</span>
            Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            FasterQ and its affiliates shall not be held liable for any direct, indirect, incidental, consequential, or exemplary damages resulting from:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Your use or inability to use FasterQ',
              'Loss of data, recordings, logs, analytics, or business opportunities',
              'Unauthorized access to your account or data',
              'Service interruptions or technical failures',
              'Issues related to third-party telecom APIs or device restrictions'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-900 font-semibold">
              Maximum Liability: In all cases, FasterQ's total liability shall not exceed the amount paid by the User for the service associated with the claim.
            </p>
          </div>
        </section>

        {/* Section 5 - Disclaimer */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">5</span>
            Disclaimer of Consequential Damages
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-gray-900 font-semibold mb-2">
              FasterQ is provided on an "AS IS" and "AS AVAILABLE" basis.
            </p>
            <p className="text-sm text-gray-700">
              We do not guarantee uninterrupted access, complete accuracy, or error-free performance.
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3">
            FasterQ shall not be liable for incidental or consequential damages including:
          </p>
          <ul className="space-y-2">
            {[
              'Loss of profits',
              'Business interruption',
              'Damage to device or hardware',
              'Loss of call recordings or synced data'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sections 6-8 (Compact) */}
        {[
          { 
            num: 6, 
            title: "Ownership & Rights",
            icon: Copyright,
            content: "All intellectual property, design elements, software code, analytics algorithms, user interface components, and documentation are the sole property of FasterQ. Users receive a limited, non-transferable license to access FasterQ for personal or organizational use. Redistribution or resale is strictly prohibited."
          },
          { 
            num: 7, 
            title: "Service Modifications & Termination",
            icon: AlertTriangle,
            content: "FasterQ reserves the right to modify, suspend, or terminate services at any time, with or without notice, especially in cases of misuse or breach of Terms."
          },
          { 
            num: 8, 
            title: "Third-Party Interactions",
            icon: Shield,
            content: "FasterQ interacts with external systems such as Android call logs, telecom APIs, cloud vendors, and third-party analytics tools. We are not responsible for issues caused due to their failure, restrictions, or changes."
          }
        ].map((section) => (
          <section key={section.num} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center">
                <section.icon className="w-5 h-5 text-white" />
              </span>
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </section>
        ))}

        {/* Section 9 - Governing Law */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </span>
            Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in <strong>Bengaluru, Karnataka</strong>.
          </p>
        </section>

        {/* Section 10 - Copyright */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center">
              <Copyright className="w-5 h-5 text-white" />
            </span>
            Copyright Notice
          </h2>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-4">
            <p className="text-gray-900 font-semibold">
              © 2025 FasterQ. All Rights Reserved.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              No part of the App or website may be reproduced or distributed without written permission from the Company.
            </p>
          </div>
        </section>

        {/* Section 11 - Contact */}
        <section className="bg-gradient-to-br from-[#FF5211] to-orange-600 text-white rounded-2xl p-8 shadow-2xl shadow-orange-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold">11</span>
            Contact Information
          </h2>
          <p className="text-white/90 mb-4">For questions regarding these Terms, contact us at:</p>
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