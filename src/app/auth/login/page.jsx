"use client";

import { useState } from "react";
import { Lock, Phone, Eye, EyeOff } from "lucide-react"; // 👀 eye icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 for toggle
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(loginUser({ mobile, password, rememberMe })).unwrap();
      toast.success("Login successful!");
      router.push("/company/admin");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-soft rounded-2xl p-6 shadow-sm max-w-md w-full">
      <h1 className="text-2xl font-bold text-dark mb-1">Welcome Back</h1>
      <p className="text-sm text-gray-500 mb-6">Login with your mobile number</p>

      <form onSubmit={handleSubmit}>
        {/* Mobile */}
        <div className="mb-4">
          <label className="text-sm font-medium text-dark mb-1 block">Mobile Number</label>
          <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
            <Phone className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"       // numeric keyboard (mobile devices)
              pattern="[0-9]*"          // sirf digits allow
              // maxLength={10}            // 10 digit limit
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} // 👈 non-digit hatao
              className="flex-1 px-2 py-2 focus:outline-none text-sm"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-dark mb-1 block">Password</label>
          <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
            <Lock className="w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"} // 👈 toggle here
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-2 py-2 focus:outline-none text-sm"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400 hover:text-dark focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full bg-primary text-white py-3 rounded-lg text-sm font-medium transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
