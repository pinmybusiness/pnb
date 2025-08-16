// app/company/admin/page.jsx
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CompanyAdminDashboard({ children }) {
  return (
    <DashboardLayout panel="companyCRM">
     {children}
    </DashboardLayout>
  );
}
