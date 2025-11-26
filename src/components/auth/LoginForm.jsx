"use client";

import { useEffect, useState } from "react";
import { Lock, Phone, Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";

export default function LoginForm({ onSuccess }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user) {
      if (onSuccess) onSuccess();
      router.push("/dashboard");
    }
  }, [user, token, onSuccess, router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // form submit / Enter dono ke liye
    if (isLoading) return;

    setIsLoading(true);

    try {
      await dispatch(loginUser({ mobile, password, rememberMe })).unwrap();
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // yahan pe form use karo
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Mobile Number Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#FF5211]" />
          Mobile Number
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211]/20 to-orange-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#FF5211] focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-300">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Phone className="w-4 h-4 text-[#FF5211]" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="flex-1 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#FF5211]" />
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211]/20 to-orange-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#FF5211] focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-300">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Lock className="w-4 h-4 text-[#FF5211]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 p-2 text-gray-400 hover:text-[#FF5211] hover:bg-orange-50 rounded-lg transition-all duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit" // IMPORTANT
        disabled={isLoading}
        className="relative w-full group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] via-orange-500 to-orange-600 rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <div
          className={`relative px-6 py-4 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all duration-300 ${
            isLoading ? "opacity-70" : "group-hover:scale-[1.02]"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Login to Dashboard</span>
            </>
          )}
        </div>
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Shield className="w-4 h-4 text-green-600" />
        <p className="text-xs font-medium text-gray-500">
          Secure login with end-to-end encryption
        </p>
      </div>
    </form>
  );
}
