"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff, Shield, Check, AlertCircle, ArrowRight } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // 🔥 Password Strength Function
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "text-red-600 bg-red-50 border-red-200" };
    if (strength <= 3) return { strength, label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    return { strength, label: "Strong", color: "text-green-600 bg-green-50 border-green-200" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // 🟢 REAL API CALL (IMPORTANT)
  const handleChangePassword = async () => {
    setError("");
    setMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password & confirm password do not match");
    }

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    try {
      setLoading(true);

      const res = await apiClient.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        return setError(data.message || "Something went wrong");
      }

      // SUCCESS
      setMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden flex items-center justify-center py-2 px-4">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Change Password</h1>
              <p className="text-white/90 text-sm">Keep your account secure with a strong password</p>
            </div>
          </div>

          <div className="p-8">
            {/* ERROR */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
              </div>
            )}

            {/* SUCCESS */}
            {msg && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-green-800 flex-1">{msg}</p>
              </div>
            )}

            {/* FORM FIELDS */}
            <div className="space-y-6">

              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FF5211]" />
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full bg-gray-50 border-2 border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#FF5211]/20 focus:border-[#FF5211] transition-all pr-12 text-gray-900"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD FIELD + STRENGTH */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FF5211]" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full bg-gray-50 border-2 border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#FF5211]/20 focus:border-[#FF5211] transition-all pr-12 text-gray-900"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Password Strength</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full ${
                            level <= passwordStrength.strength
                              ? passwordStrength.strength <= 2
                                ? "bg-red-500"
                                : passwordStrength.strength <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FF5211]" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full bg-gray-50 border-2 border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#FF5211]/20 focus:border-[#FF5211] transition-all pr-12 text-gray-900"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}

                {confirmPassword && newPassword === confirmPassword && (
                  <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                onClick={handleChangePassword}
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                className={`w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white p-4 rounded-full font-bold text-lg transition-all shadow-lg inline-flex items-center justify-center gap-3 group ${
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-2xl hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Change Password</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Your password is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
