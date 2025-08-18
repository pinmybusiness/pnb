import BranchForm from '@/components/BranchForm';

export default async function EditBranchPage({ params }) {
  const { id } = await params; // ⬅️ await 
  return (
    <div className="container mx-auto px-4 py-8">
      <BranchForm id={id} />
    </div>
  );
}