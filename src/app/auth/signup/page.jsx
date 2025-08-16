"use client";

import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="bg-white border border-soft rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-dark mb-1">Create Account</h1>
      <p className="text-sm text-gray-500 mb-6">Sign up for a new account</p>

      {/* Name */}
      <div className="mb-4">
        <label className="text-sm font-medium text-dark mb-1 block">Full Name</label>
        <div className="flex items-center border border-soft rounded-lg px-3">
          <User className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1 px-2 py-2 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="text-sm font-medium text-dark mb-1 block">Email</label>
        <div className="flex items-center border border-soft rounded-lg px-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="flex-1 px-2 py-2 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="text-sm font-medium text-dark mb-1 block">Password</label>
        <div className="flex items-center border border-soft rounded-lg px-3">
          <Lock className="w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="flex-1 px-2 py-2 focus:outline-none text-sm"
          />
        </div>
      </div>

      <button className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-lg text-sm font-medium">
        Sign Up
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
