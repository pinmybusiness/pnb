"use client";

import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PropTypes from "prop-types";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import RestaurantLoginForm from "@/components/auth/RestaurantLoginForm";

export default function LoginPage({ initialTab = "restaurant" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header with Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
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
          </div>

          {/* Content */}
          <div className="p-6" role="tabpanel" aria-labelledby={activeTab === "candidate" ? "candidate-tab" : "restaurant-tab"}>
            {activeTab === "candidate" ? (
              <div>
                <h2 id="login-page-title" className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Candidate Login
                </h2>
                <GoogleLoginButton />
              </div>
            ) : (
              <div>
                <RestaurantLoginForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

LoginPage.propTypes = {
  initialTab: PropTypes.oneOf(["candidate", "restaurant"]),
};