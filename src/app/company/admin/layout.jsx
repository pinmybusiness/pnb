// app/company/admin/page.jsx
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CompanyAdminDashboard({ children }) {
  return (
     <ProtectedRoute requiredRole="admin">
      <DashboardLayout panel="companyAdmin">
        {children}
      </DashboardLayout>
     </ProtectedRoute>
  );
}
