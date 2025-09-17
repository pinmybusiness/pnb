// components/auth/AuthModal.jsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import CandidateLoginForm from "./CandidateLoginForm";
import RegisterCandidate from "./RegisterCandidate";

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  formFields,
  onRegisterSubmit,
  cities,
  initialFormData,
}) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {isLogin ? (
          <>
            <CandidateLoginForm onSuccess={onSuccess} />
            <p className="text-center text-sm text-gray-600 mt-4 pb-6">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-orange-500 font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterCandidate
              initialFormData={initialFormData}
              formFields={formFields}
              onSubmit={onRegisterSubmit}
              title="Candidate Registration"
              submitButtonText="Register Now"
              footerLink={{
                text: "Already have an account?",
                href: "#",
                linkText: (
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    Login
                  </button>
                ),
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}