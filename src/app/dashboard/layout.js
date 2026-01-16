// app/dashboard/layout.js
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthProvider from "@/components/AuthProvider";
import { Providers } from "../providers";
import "../dashboard.css";

export default function Dashboard({ children }) {
  return (
    <Providers>
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    </Providers>
  );
}