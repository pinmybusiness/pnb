import HeavyChartsPage from "@/components/dashboard/HeavyChartsPage";
import { Metadata } from "next";

export const metadata = {
  title: "Advanced Analytics | Call Center Dashboard",
  description: "Detailed call analytics and insights"
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <HeavyChartsPage />
    </div>
  );
}