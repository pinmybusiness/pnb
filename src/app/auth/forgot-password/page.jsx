"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white border border-soft rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-dark mb-1">Forgot Password</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your email to reset your password</p>

      <div className="mb-4">
        <label className="text-sm font-medium text-dark mb-1 block">Email</label>
        <div className="flex items-center border border-soft rounded-lg px-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-2 py-2 focus:outline-none text-sm"
          />
        </div>
      </div>

      <button className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-lg text-sm font-medium">
        Send Reset Link
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
