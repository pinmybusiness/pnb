"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PropTypes from "prop-types";
import RestaurantLoginForm from "./RestaurantLoginForm";

export default function LoginModal({ isOpen, onClose }) {
  // Handle keyboard close
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Prevent body scroll when modal is open
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
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h2 id="login-modal-title" className="text-lg font-semibold text-gray-800">
              Login
            </h2>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Close login modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <RestaurantLoginForm onSuccess={onClose} />
            <button
              onClick={onClose}
              className="w-full mt-4 text-sm font-medium text-gray-600 hover:text-orange-600 hover:underline transition focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
