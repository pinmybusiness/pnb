"use client";

import { Providers } from "../providers";
import RestaurantLoginForm from "@/components/auth/RestaurantLoginForm";

export default function LoginPage() {
  return (
    <Providers>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 py-3 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Login
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <RestaurantLoginForm />
          </div>
        </div>
      </div>
    </Providers>
  );
}
