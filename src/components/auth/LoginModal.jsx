"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";
import RestaurantLoginForm from "./RestaurantLoginForm";
import PropTypes from "prop-types";
import CandidateLoginForm from "./CandidateLoginForm";

export default function LoginModal({ isOpen, onClose, initialTab = "candidate" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update active tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Handle keyboard accessibility for closing modal
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
          {/* Modal Header with Tabs */}
          <div className="flex border-b border-gray-200 relative bg-gray-50">
            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                activeTab === "candidate"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
              aria-selected={activeTab === "candidate"}
              role="tab"
              id="candidate-tab"
            >
              Candidate
            </button>
            <button
              onClick={() => setActiveTab("restaurant")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                activeTab === "restaurant"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
              aria-selected={activeTab === "restaurant"}
              role="tab"
              id="restaurant-tab"
            >
              Restaurant
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Close login modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="relative p-6" role="tabpanel" aria-labelledby={activeTab === "candidate" ? "candidate-tab" : "restaurant-tab"}>
            {activeTab === "candidate" ? (
              <div>
                {/* <h2 id="login-modal-title" className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Candidate Login
                </h2> */}
                <CandidateLoginForm />
                <button
                  onClick={onClose}
                  className="w-full mt-4 text-sm font-medium text-gray-600 hover:text-orange-600 hover:underline transition focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Cancel login"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <RestaurantLoginForm onSuccess={onClose} />
                <button
                  onClick={onClose}
                  className="w-full mt-4 text-sm font-medium text-gray-600 hover:text-orange-600 hover:underline transition focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Cancel login"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(["candidate", "restaurant"]),
};