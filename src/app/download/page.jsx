
import { Download, Shield, Zap, Check, Star, Users, ArrowRight, Smartphone, CheckCircle, Clock, Phone } from "lucide-react";

const APK_URL = "https://cdn.fasterq.in/images/fasterq-app.apk";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white relative overflow-hidden">
{/* Animated background elements with mesh gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-yellow-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Decorative grid pattern with dots */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FF5211 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5211] to-transparent animate-shimmer"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl p-4 shadow-2xl border-4 border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              📱 Mobile App
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
              Download <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Trackly</span> App
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Smart call tracking for your business. Track calls, follow-ups & conversions — all in one place.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                <Users className="w-5 h-5 text-[#FF5211]" />
                <span className="text-sm font-bold text-gray-900">200+ Downloads</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-gray-900">4.8 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-gray-900">100% Secure</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
            {/* Left: Download Section */}
            <div className="space-y-6">
              {/* Download Card */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-[#FF5211]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Android App</h3>
                      <p className="text-sm text-gray-600">Version 1.0.0 • 6.5 MB</p>
                    </div>
                  </div>

                  <a
                    href={APK_URL}
                    download
                    className="w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3 group/btn shadow-xl mb-4"
                  >
                    <Download className="w-6 h-6 group-hover/btn:animate-bounce" />
                    <span>Download APK Now</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free • No registration required</span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-blue-900 text-sm mb-1">Coming Soon on Play Store</p>
                        <p className="text-xs text-blue-700">Currently in review process. Download APK for instant access!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation Steps */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF5211]" />
                  Quick Installation Guide
                </h4>
                <div className="space-y-3">
                  {[
                    "Download the APK file to your device",
                    "Enable 'Install from Unknown Sources' in Settings",
                    "Open the downloaded file and tap Install",
                    "Launch Trackly and start tracking calls!"
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 group/step">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold group-hover/step:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 mb-1">100% Safe & Secure</h4>
                    <p className="text-sm text-green-700">Verified by security experts. No malware, no data theft.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: App Preview */}
            <div className="relative">
              {/* Main Phone Mockup */}
              <div className="relative mx-auto max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-[3rem] blur-3xl opacity-20 animate-pulse"></div>
                
                <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
                  
                  {/* Screen */}
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="aspect-[9/19] bg-gradient-to-br from-[#FFF5EC] to-orange-50 p-6">
                      {/* App Content Preview */}
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl"></div>
                            <div>
                              <h3 className="font-bold text-sm">Trackly</h3>
                              <p className="text-xs text-gray-600">Call Tracker</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-2xl p-3 shadow-sm">
                            <p className="text-xs text-gray-600 mb-1">Today's Calls</p>
                            <p className="text-2xl font-bold text-[#FF5211]">24</p>
                          </div>
                          <div className="bg-white rounded-2xl p-3 shadow-sm">
                            <p className="text-xs text-gray-600 mb-1">Duration</p>
                            <p className="text-2xl font-bold text-[#FF5211]">2.4h</p>
                          </div>
                        </div>

                        {/* Call List */}
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-2 bg-gray-100 rounded w-16"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-[140px] animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold">Real-time</span>
                </div>
                <p className="text-xs text-gray-600">Live call tracking</p>
              </div>

              <div className="absolute -right-4 top-1/2 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-[140px] animate-float" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold">Secure</span>
                </div>
                <p className="text-xs text-gray-600">Encrypted data</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <span className="inline-block px-5 py-2 bg-white text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
                ⚡ Key Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need in
                <br />
                <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">One Powerful App</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Phone, title: "Auto Call Logging", desc: "Every call tracked automatically" },
                { icon: Zap, title: "Real-time Sync", desc: "Instant data synchronization" },
                { icon: Shield, title: "Bank-Level Security", desc: "Your data stays protected" },
                { icon: Users, title: "Team Management", desc: "Monitor entire team activity" },
                { icon: Star, title: "Analytics Dashboard", desc: "Deep insights & reports" },
                { icon: CheckCircle, title: "Easy Setup", desc: "Ready in under 2 minutes" }
              ].map((feature, i) => (
                <div key={i} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-[#FF5211]" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#FF5211] transition-colors">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Common <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Questions</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "Is it safe to install?", a: "Yes! Our APK is verified and completely safe. Scanned by multiple security tools." },
                { q: "Do I need to pay?", a: "No payment needed to download. Start free and upgrade anytime." },
                { q: "Works on all Android phones?", a: "Yes! Compatible with Android 6.0 and above. Works on all devices." },
                { q: "When will it be on Play Store?", a: "We're in Google's review process. Expected launch within 2-3 weeks!" }
              ].map((faq, i) => (
                <div key={i} className="group p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                  <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#FF5211] transition-colors">{faq.q}</h4>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-[#FF5211] via-orange-600 to-orange-700 text-white rounded-3xl p-10 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Transform Your Sales?</h3>
              <p className="text-xl mb-8 text-white/90">Join 200+ businesses already using Trackly</p>
              
              <a
                href={APK_URL}
                download
                className="bg-white text-[#FF5211] px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3 group"
              >
                <Download className="w-6 h-6 group-hover:animate-bounce" />
                <span>Download Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}