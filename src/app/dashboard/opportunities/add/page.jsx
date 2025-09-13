"use client"
import OpportunityForm from '@/components/opportunity/OpportunityForm';
import { useSearchParams } from 'next/navigation';

export default function CreateInternshipPage() {
  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId');
  
  return <OpportunityForm branchId={branchId} />;
}