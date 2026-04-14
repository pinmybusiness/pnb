// app/ClientHeaderFooter.js — footer only
// Header has been moved to layout.js (rendered via HeaderWrapper outside PersistGate).
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ClientHeaderFooter({ position }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute) return null;
  if (position === "footer") return <Footer />;
  return null;
}
