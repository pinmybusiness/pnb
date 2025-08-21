"use client"
import BranchForm from '@/components/BranchForm';
import { useRouter } from 'next/navigation';

export default async function EditBranchPage({ params }) {
   const router = useRouter();
  const { id } = await params; // ⬅️ await 
  return (
    <div className="container mx-auto px-4 py-8">
      <BranchForm id={id} onClose={() => router.push('/company/admin/branches')} />
    </div>
  );
}