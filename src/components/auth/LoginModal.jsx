"use client";

import { useEffect, useCallback, useState } from "react";
import { X, Lock, Phone, Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";
import LoginForm from "./LoginForm";

export default function LoginModal({ isOpen, onClose }) {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-500 scale-100 animate-slideUp">
        {/* Decorative Header Background */}
        <div className="relative bg-gradient-to-br from-[#FFF5EC] via-orange-50 to-white px-8 py-6 border-b-2 border-orange-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5211]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/10 rounded-full blur-2xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 id="login-modal-title" className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-600 font-medium">Login to your account</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group"
              aria-label="Close login modal"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <LoginForm onSuccess={onClose} />
          
          {/* Footer */}
          {/* <div className="mt-6 pt-6 border-t-2 border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-bold text-[#FF5211] hover:text-orange-600 hover:underline transition-colors">
                Sign up now
              </a>
            </p>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

// LoginModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };