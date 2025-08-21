"use client"
import UserForm from "@/components/UserForm";
import { useRouter } from "next/navigation";

export default function AddTeamPage() {
    const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <UserForm   onClose={() => router.push('/dashboard/teams')} />
    </div>
  );
}