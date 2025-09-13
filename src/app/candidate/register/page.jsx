import { authService } from "@/services/authService";
import { makeStore } from "@/store";
import { Providers } from "../../providers";
import axios from "axios";
import RegisterFormContent from "@/components/csr/RegisterFormContent";

// Server Component (Root)
export default async function RegisterPage() {
  const store = makeStore();
  let initialReduxState = {};
  let cities = [];
  let isAuthenticated = false;

  // Check auth status
  try {
    const { cookies } = await import("next/headers");
    const token = cookies().get("token")?.value;
    if (token) {
      const response = await authService.getMe();
      if (response.success) {
        store.dispatch({
          type: "auth/setCredentials",
          payload: { user: response.data.user, token },
        });
        isAuthenticated = true;
      }
    }
  } catch (error) {
    console.error("Failed to check auth:", error);
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return {
      redirect: {
        destination: "/jobs",
        permanent: false,
      },
    };
  }

  // Fetch cities
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`, {
      cache: "no-store", // Avoid caching for fresh data
    });
    cities = response.data.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load</h2>
          <p className="text-gray-600 mb-6">Unable to fetch cities. Please try again later.</p>
          <a href="/" className="inline-flex items-center text-orange-500 font-semibold hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  initialReduxState = store.getState();

  // Set default city (Hyderabad, Telangana)
  const hyderabad = cities.find((city) => city.name === "Hyderabad" && city.stateName === "Telangana");
  const initialFormData = {
    name: "",
    mobile: "",
    password: "",
    location: hyderabad
      ? {
          value: hyderabad._id,
          label: `${hyderabad.name}, ${hyderabad.stateName}`,
          _id: hyderabad._id,
        }
      : null,
  };

  return (
    <Providers initialReduxState={initialReduxState}>
      <RegisterFormContent initialFormData={initialFormData} cities={cities} />
    </Providers>
  );
}