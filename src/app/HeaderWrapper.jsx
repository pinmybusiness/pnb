"use client";

// Minimal provider for the Header — Redux + Google OAuth only.
// Deliberately excludes PersistGate so Header renders during SSR.
// PersistGate (loading=null) would suppress all output during server render.

import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { makeStore } from "@/store";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Read redux-persist auth state from localStorage synchronously so the
// store is pre-populated before the first render — eliminates the Login→Profile flash.
function readPersistedAuth() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("persist:auth");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      auth: {
        user: parsed.user ? JSON.parse(parsed.user) : null,
        isAuthenticated: parsed.isAuthenticated === "true",
        isLoading: false,
        error: null,
        isInitialized: false,
      },
    };
  } catch {
    return {};
  }
}

export default function HeaderWrapper({ children }) {
  const [store] = useState(() => makeStore(readPersistedAuth()));
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </Provider>
  );
}
