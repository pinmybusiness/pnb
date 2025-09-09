// app/dashboard/layout.js
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Providers } from "../providers";

export default function Dashboard({ children }) {
  return (
    <Providers>
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
    </Providers>
  );
}