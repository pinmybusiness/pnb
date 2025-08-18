"use client"
import BranchForm from "@/components/BranchForm";
import { useRouter } from "next/navigation";

export default function AddBranchPage() {
    const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <BranchForm   onClose={() => router.push('/company/admin/branches')} />
    </div>
  );
}