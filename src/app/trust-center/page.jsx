// app/trust-center/page.jsx
export const metadata = {
  title: "Trust Center | FasterQ",
  description: "Learn how FasterQ protects your SIM-based call tracking data with secure AWS infrastructure, encrypted storage, and automated daily backups in India.",
}

export default function TrustCenter() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -left-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200/25 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium border border-orange-100 shadow-sm">
            <span className="text-lg">🇮🇳</span> Built & Hosted in India
          </span>
          
          <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
            Your Sales Data.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-500">
              Secured by Design.
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            FasterQ protects your SIM-based call tracking data using secure AWS infrastructure, 
            encrypted storage, daily automated backups, and strict access controls.
          </p>
        </div>
      </section>

      {/* India-First Security Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Designed for Indian Sales Teams
        </h2>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-orange-100 shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <p className="text-gray-700">Works with real SIM-based calls, not VoIP</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔢</span>
                <p className="text-gray-700">Your business numbers remain unchanged</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">☁️</span>
                <p className="text-gray-700">Data stored securely on AWS India servers</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <p className="text-gray-700">No third-party data selling</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👥</span>
                <p className="text-gray-700">Access restricted to authorized team members only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Framework Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Our Security Framework
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="group bg-white rounded-3xl p-8 border border-orange-100 shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Secure AWS Infrastructure</h3>
            <p className="text-gray-600 leading-relaxed">
              Hosted on secure AWS cloud servers with network isolation and strict IAM policies.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-3xl p-8 border border-orange-100 shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Encrypted Data</h3>
            <p className="text-gray-600 leading-relaxed">
              All data is encrypted in transit (TLS 1.2+) and at rest using secure storage layers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-3xl p-8 border border-orange-100 shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Automated Daily Backups</h3>
            <p className="text-gray-600 leading-relaxed">
              Backup snapshots are created every 24 hours and retained for 7 days to ensure recovery.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group bg-white rounded-3xl p-8 border border-orange-100 shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Role-Based Access Control</h3>
            <p className="text-gray-600 leading-relaxed">
              Only authorized users can access data through permission-based access systems.
            </p>
          </div>
        </div>
      </section>

      {/* Backup & Recovery Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Daily Backup & Recovery System
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Bullet points */}
          <div className="space-y-6">
            {[
              'Snapshot created every 24 hours',
              '7-day rolling retention policy',
              'Encrypted S3-based storage',
              'Rapid recovery capability',
              'Infrastructure health monitoring',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xl text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          {/* Right side - Status Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211]/20 to-orange-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-orange-100 animate-float">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">System Status</h3>
              <div className="space-y-4">
                {[
                  { label: 'System Status', value: 'Operational', color: 'text-green-600' },
                  { label: 'Backup Status', value: 'Active', color: 'text-green-600' },
                  { label: 'Last Snapshot', value: 'Today 02:00 AM', color: 'text-gray-900' },
                  { label: 'Retention', value: '7 Days', color: 'text-gray-900' },
                  { label: 'Encryption', value: 'Enabled', color: 'text-green-600' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Reliability Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Reliable & Monitored Infrastructure
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { stat: '99.9%', label: 'Platform Uptime', icon: '⚡' },
            { stat: '24/7', label: 'Real-Time Monitoring', icon: '👁️' },
            { stat: 'Instant', label: 'Automated Alerts', icon: '🔔' },
            { stat: 'TLS 1.2+', label: 'Secure HTTPS', icon: '🔒' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-lg text-center group hover:shadow-xl transition-all">
              <span className="text-4xl mb-3 block">{item.icon}</span>
              <div className="text-2xl font-bold text-gray-900">{item.stat}</div>
              <div className="text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Best Practices Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-orange-50 to-orange-100/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Security Best Practices
          </h2>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'HTTPS across the entire platform',
                'TLS 1.2+ encrypted communication',
                'Strict IAM role policies',
                'Least privilege access model',
                'Daily infrastructure monitoring',
                'Secure backup retention',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#FF5211] to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-6 bg-gradient-to-r from-[#FF5211] to-orange-600">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Security Is Not an Add-On.
            <span className="block">It's Built Into FasterQ.</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            We continuously monitor, secure, and improve our infrastructure to protect your sales data.
          </p>
          <a href="/contact" className="bg-white text-[#FF5211] px-10 py-5 rounded-full text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 border-2 border-white/20">
            Talk to Our Team
          </a>
        </div>
      </section>
    </main>
  )
}