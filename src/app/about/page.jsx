"use client";

import { ArrowRight, Users, Zap, Shield, Heart, Target, Rocket, Phone, Mail, MessageSquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF5211] via-orange-600 to-orange-700 text-white py-20 md:py-28 px-4 md:px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-6 border border-white/30">
            🚀 Launched October 2025
          </span>
          <h1 className="!text-4xl md:!text-5xl lg:!text-6xl font-extrabold mb-6 leading-tight">
            Track Every Call.
            <br />
            Close Every Deal.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-white/90">
            Trackly by FasterQ is your SIM-based call tracking powerhouse -logging every incoming, outgoing, and missed call in real-time, without changing your number. Built for Indian SMBs with rupee pricing, IST support, and a passion for simplifying sales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="/contact"
              className="bg-white text-[#FF5211] px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group"
            >
              <span>Start for ₹99/month</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#demo"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:!text-[#FF5211] transition-all hover:scale-105"
            >
              See Demo
            </a>
          </div>
          
          <p className="text-base md:text-lg text-white/80 flex items-center justify-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Join our beta community -early adopters shaping the future of sales tracking in India
          </p>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-orange-50/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2 bg-white text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              💡 Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Trackly Stands Out for
              <br />
              <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Startups Like Yours</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Phone, emoji: '📱', title: 'SIM-First Tracking', desc: 'No number changes or VoIP -track calls seamlessly on your existing SIM cards, perfect for bootstrapped teams.' },
              { icon: Zap, emoji: '📊', title: 'Real-Time Dashboards', desc: 'Instant insights into call patterns and team performance, fueling growth from day one.' },
              { icon: MessageSquare, emoji: '💬', title: 'WhatsApp Alerts', desc: 'Daily summaries and missed call notifications delivered directly to your phone -stay connected on the go.' },
              { icon: Shield, emoji: '🇮🇳', title: 'India-Hosted & Local Support', desc: 'Data stored in India with lightning-fast IST support and affordable rupee pricing tailored for Indian hustlers.' },
            ].map((item, idx) => (
              <div key={idx} className="group bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>
                
                <div className="relative text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#FF5211]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <item.icon className="w-8 h-8 text-[#FF5211]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#FF5211] transition-colors">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2 bg-orange-50 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20">
              ⚡ Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How Trackly Works -
              <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Simple as That</span>
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5211]/20 to-transparent"></div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: '✏️', title: 'Sign Up & Invite Team', desc: 'Get started in under 5 minutes -create your account and onboard your crew with zero friction.' },
                { step: '2', icon: '📲', title: 'Install App & Link SIMs', desc: 'Grab our lightweight app, link your SIMs on everyday phones -no fancy hardware required.' },
                { step: '3', icon: '📈', title: 'View Dashboards & Reports', desc: 'Dive into real-time logs, analytics, and WhatsApp digests to supercharge your decisions.' },
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="mt-6 h-1 w-12 bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full mx-auto group-hover:w-full transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Snapshot */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-[#FFF5EC] to-orange-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2 bg-white text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              🚀 Full Feature Set
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Features Built for
              <br />
              <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Fast-Moving Teams</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {[
              { feature: 'Auto Call Logging', benefit: 'Capture every incoming, outgoing, and missed call automatically -total visibility without the hassle.' },
              { feature: 'Missed Call Alerts', benefit: 'Instant WhatsApp or SMS pings to chase leads before they ghost you.' },
              { feature: 'Call Duration & Recordings', benefit: 'Measure engagement time and record for coaching -level up your reps quickly.' },
              { feature: 'CRM Integrations', benefit: 'Plug into Zoho, HubSpot, LeadSquared -calls auto-sync to your pipeline.' },
              { feature: 'Export & Reports', benefit: 'Pull custom reports and exports for audits or investor updates -startup essentials.' },
              { feature: 'Daily WhatsApp Summary', benefit: 'Get bite-sized team insights on WhatsApp -stay sharp without app overload.' },
            ].map((item, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-5 md:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-1">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#FF5211] transition-colors">{item.feature}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Story */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2 bg-orange-50 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20">
              👥 Our Story
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Fresh Start</span>
            </h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Launched in <span className="font-bold text-[#FF5211]">October 2025</span> right here in Bengaluru, FasterQ was born from three friends' late-night chats about broken call tracking tools that kill sales momentum. Tired of clunky VoIP setups and foreign software ignoring Indian realities, we bootstrapped Trackly to make sales tracking dead simple and hyper-local.
              </p>
              <p className="text-gray-600">
                No VC fairy dust -just grit, code, and a love for helping Indian startups punch above their weight. From our co-working desk to your dashboard, we're all in on building tools that scale with your hustle.
              </p>
              <p className="text-gray-600">
                Trackly isn't just software; it's our bet on a future where every SMB sales call counts. <span className="font-semibold text-[#FF5211]">Join us in writing this story.</span>
              </p>
            </div>
          </div>

          {/* <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Amit Sharma', role: 'Founder & CEO – The Visionary Hustler', initials: 'AS' },
              { name: 'Priya Singh', role: 'CTO – The Code Whisperer', initials: 'PS' },
              { name: 'Rahul Desai', role: 'Head of Product – The User Advocate', initials: 'RD' },
            ].map((member, idx) => (
              <div key={idx} className="group text-center bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    {member.initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#FF5211] transition-colors">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Values & Trust */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-orange-50/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 bg-white text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              💎 Our Values
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Drives Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Zap, title: 'Simplicity', desc: 'Clean tools for chaotic startup life -no fluff, all impact.' },
              { icon: Target, title: 'Transparency', desc: 'Straight-up pricing, open roadmaps, and zero surprises.' },
              { icon: Heart, title: 'Local First', desc: 'Built by Indians, for Indians -24/7 IST support included.' },
              { icon: Shield, title: 'Privacy Obsessed', desc: 'End-to-end encryption and India-hosted data, because trust is our MVP.' },
            ].map((value, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FF5211]/30">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-[#FF5211]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#FF5211] transition-colors">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-3xl p-8 border border-blue-200/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-700 leading-relaxed flex-1">
                We're all about keeping your data safe in India -<span className="font-semibold">encrypted at rest and in transit on AWS Mumbai</span>, compliant with DPDP Act from launch day. No foreign clouds, no funny business. Your peace of mind? <span className="font-bold text-blue-700">That's non-negotiable</span> as we grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-r from-[#FF5211] via-orange-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Rocket className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Ready to Level Up Your Calls?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Be part of our launch squad -unlock beta perks and shape Trackly's roadmap. No card needed to start.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="/contact"
              className="bg-white text-[#FF5211] px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3 group"
            >
              <span>Launch for ₹99/month</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:!text-[#FF5211] transition-all hover:scale-105"
            >
              Chat with Us
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
            <a href="mailto:info@fasterq.in" className="flex items-center gap-2 hover:text-white transition-colors group">
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="underline">info@fasterq.in</span>
            </a>
            <a href="https://wa.me/919798288748" className="flex items-center gap-2 hover:text-white transition-colors group">
              <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="underline">WhatsApp +91 97982 88748</span>
            </a>
          </div>
          <p className="text-sm text-white/70 mt-4">We reply faster than a startup pivot 🚀</p>
        </div>
      </section>
    </div>
  );
}