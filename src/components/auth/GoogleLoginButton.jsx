"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { googleLoginUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";

export default function GoogleLoginButton({ onSuccess }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState(null);

  // Handle navigation based on Redux state
  useEffect(() => {
    if (token && user) {
      if (user.role !== 10) {
        setLocalError("User is not a candidate");
        toast.error("User is not a candidate");
        return;
      }
      if (onSuccess) onSuccess();
      if (!user.candidateProfile?.gender) {
        console.log("yes", user.candidateProfile?.gender)
        router.push("/candidate/profile");
      } else {
        router.push("/jobs");
      }
    }
    if (error) {
      setLocalError(error);
      toast.error(error || "Google login failed. Please try again.");
    }
  }, [token, user, error, router, onSuccess]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (authResult) => {
      try {
        if (!authResult.code) {
          throw new Error("No authorization code received");
        }
        await dispatch(googleLoginUser(authResult.code)).unwrap();
        toast.success("Google login successful!");
      } catch (err) {
        setLocalError(err.message || "Google login failed");
        toast.error(err.message || "Google login failed. Please try again.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
      setLocalError("Google login failed. Please try again.");
      toast.error("Google login failed. Please try again.");
    },
    flow: "auth-code",
    scope: "openid email profile",
  });

  return (
    <div className="relative">
      {localError && <p className="text-red-600 text-sm mb-2">{localError}</p>}
      <button
        onClick={googleLogin}
        disabled={isLoading}
        className={`flex items-center justify-center w-full gap-3 px-6 py-3 rounded-full bg-white border border-gray-300 shadow-md transition duration-200 ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:bg-gray-50"
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
          <path
            fill="#4285f4"
            d="M533.5 278.4c0-17.4-1.4-34.1-4-50.3H272v95.1h146.9c-6.3 34.3-25.2 63.5-53.8 83v68h86.9c50.8-46.8 81.5-115.7 81.5-195.8z"
          />
          <path
            fill="#34a853"
            d="M272 544.3c72.6 0 133.5-24 178-65.3l-86.9-68c-24.1 16.2-55 25.7-91.1 25.7-70.1 0-129.5-47.2-150.7-110.5h-89v69.5c44.4 87.8 135.9 149.6 239.7 149.6z"
          />
          <path
            fill="#fbbc04"
            d="M121.3 325.9c-10.3-30.1-10.3-62.6 0-92.7v-69.5h-89c-37.4 73.7-37.4 160.9 0 234.6l89-72.4z"
          />
          <path
            fill="#ea4335"
            d="M272 107.7c39.4 0 74.7 13.5 102.5 40.2l76.9-76.9C405.4 24 344.5 0 272 0 168.2 0 76.7 61.8 32.3 149.6l89 69.5C142.5 154.9 201.9 107.7 272 107.7z"
          />
        </svg>
        <span className="text-base font-semibold text-gray-700">
          {isLoading ? "Logging in..." : "Continue with Google"}
        </span>
      </button>
    </div>
  );
}