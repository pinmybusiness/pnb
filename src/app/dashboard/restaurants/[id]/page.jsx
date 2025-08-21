import RestaurantForm from '@/components/RestaurantForm';

export default async function EditRestaurantPage({ params }) {
  const { id } = await params; // ⬅️ await 

  return (
    <div className="container mx-auto px-4 py-8">
      <RestaurantForm id={id} />
    </div>
  );
}
