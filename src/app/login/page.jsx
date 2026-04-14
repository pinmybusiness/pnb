"use client";

import { Providers } from "../providers";
import LoginForm from "@/components/auth/LoginForm";
import { Lock, Sparkles, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <Providers>
      <div className="min-h-screen -mt-10 flex items-center justify-center bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white relative overflow-hidden p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>


        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md">
          {/* Floating feature cards */}
          <div className="hidden md:block absolute -left-32 z-11 top-1/4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-[180px] animate-float">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-bold">Real-time Sync</span>
            </div>
            <p className="text-xs text-gray-600">Instant call tracking</p>
          </div>

          <div className="hidden md:block absolute -right-32 z-11 top-1/3 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-[160px] animate-float" style={{animationDelay: '1s'}}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-bold">Secure</span>
            </div>
            <p className="text-xs text-gray-600">Bank-level encryption</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-[#FF5211]/10">
            {/* Decorative Header Background */}
            <div className="relative bg-gradient-to-br from-[#FFF5EC] via-orange-50 to-white px-8 py-8 border-b-2 border-orange-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5211]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/10 rounded-full blur-2xl"></div>
              
              <div className="relative text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                  Login to access your FasterQ dashboard
                </p>

                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-100 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#FF5211]" />
                  <span className="text-xs font-semibold text-gray-700">Trusted by 200+ teams</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <LoginForm />
              
              {/* Footer Links */}
              {/* <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="/register" className="font-bold text-[#FF5211] hover:text-orange-600 hover:underline transition-colors">
                    Sign up now
                  </a>
                </p>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span>Secure login • End-to-end encrypted</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By logging in, you agree to our{" "}
            <a href="https://www.fasterq.in/terms-and-conditions" className="text-[#FF5211] hover:underline">Terms</a>
            {" "}and{" "}
            <a href="https://www.fasterq.in/privacy-policy" className="text-[#FF5211] hover:underline">Privacy Policy</a>
          </p>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </Providers>
  );
}