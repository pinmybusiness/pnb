import PhonePreview from "@/components/PhonePreview";
import { Download, Shield, Zap, Star, Users, ArrowRight, CheckCircle, Clock, Phone } from "lucide-react";

const APK_URL = "https://cdn.fasterq.in/images/app/fasterq-3.0.5.apk";

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

            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              📱 Mobile App
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
              Download <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">FasterQ</span> App
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Smart call tracking for your business. Track calls, follow-ups & conversions — all in one place.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                <Users className="w-5 h-5 text-[#FF5211]" />
                <span className="text-sm font-bold text-gray-900">5,000+ Downloads</span>
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
              <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-[#FF5211]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Android App</h3>
                      <p className="text-sm text-gray-600">Version 3.0.5 • 7.7 MB</p>
                    </div>
                  </div>

                  <a
                    href={APK_URL}
                    download
                    className="w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3 group/btn shadow-xl mb-4"
                  >
                    <Download className="w-6 h-6 group-hover/btn:animate-bounce" />
                    <span>Download</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>


                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-blue-900 text-sm mb-1">Coming Soon on Play Store</p>
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
                    "Launch FasterQ and start tracking calls!"
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
              <PhonePreview />

              
            </div>
          </div>
        {/* App Setup Instructions */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-20">
          <h4 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#FF5211]" />
            Important Setup Instructions
          </h4>

          <div className="space-y-4 text-sm text-gray-700">

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF5211] mt-0.5 flex-shrink-0"/>
              <p>
                Select your <span className="font-semibold text-gray-900">Business SIM</span> inside the app so FasterQ can track the correct calls.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF5211] mt-0.5 flex-shrink-0"/>
              <p>
                Turn <span className="font-semibold text-gray-900">Call Recording ON</span> in your phone’s call settings.  
                FasterQ will sync recordings only if call recording is enabled.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF5211] mt-0.5 flex-shrink-0"/>
              <p>
                Unrestrict <span className="font-semibold text-gray-900">Battery Optimization</span> for FasterQ so the app can run properly in the background.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF5211] mt-0.5 flex-shrink-0"/>
              <p>
                Enable <span className="font-semibold text-gray-900">Auto Start / Background Start</span> to ensure continuous call tracking.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF5211] mt-0.5 flex-shrink-0"/>
              <p>
                Set your <span className="font-semibold text-gray-900">Working Hours</span> in the app so FasterQ remains active in the foreground during business hours for live syncing. Calls are tracked 24/7.
              </p>
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
                { q: "Works on all Android phones?", a: "Yes! Compatible with Android 8.0 and above. Works on all devices." },
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
              <p className="text-xl mb-8 text-white/90">Join 500+ businesses already using FasterQ</p>
              
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