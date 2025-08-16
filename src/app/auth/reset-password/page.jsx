"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  return (
    <div className="bg-white border border-soft rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-dark mb-1">Reset Password</h1>
      <p className="text-sm text-gray-500 mb-6">Set your new password</p>

      {/* New Password */}
      <div className="mb-4">
        <label className="text-sm font-medium text-dark mb-1 block">New Password</label>
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

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="text-sm font-medium text-dark mb-1 block">Confirm Password</label>
        <div className="flex items-center border border-soft rounded-lg px-3">
          <Lock className="w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="flex-1 px-2 py-2 focus:outline-none text-sm"
          />
        </div>
      </div>

      <button className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-lg text-sm font-medium">
        Reset Password
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Back to{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
