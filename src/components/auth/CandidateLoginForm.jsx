// components/auth/CandidateLoginForm.jsx
"use client";

import { useEffect, useState } from "react";
import { Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";

export default function CandidateLoginForm({ onSuccess }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user && role) {
      if (onSuccess) onSuccess();
      router.push("/jobs");
    }
  }, [user, token, role, onSuccess, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(loginUser({ mobile, password, rememberMe })).unwrap();
      toast.success("Login successful!");
      router.push("/jobs");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-dark mb-1 text-center">
        Candidate Login
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Login with your mobile number
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-medium text-dark mb-1 block">
            Mobile Number
          </label>
          <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
            <Phone className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="flex-1 px-2 py-2 focus:outline-none text-sm"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-dark mb-1 block">
            Password
          </label>
          <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
            <Lock className="w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
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
    </div>
  );
}
