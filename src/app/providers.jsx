// app/providers.jsx
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import Loader from "@/components/ui/Loader";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children, initialReduxState }) {
  // If initialReduxState is provided (from server), initialize store with it
  // In this case, we're using the same store instance, but you could create a new store
  // with the initial state if needed
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
    </GoogleOAuthProvider>
  );
}