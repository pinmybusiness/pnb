import { authService } from "@/services/authService";
import { makeStore } from "@/store";
import { Providers } from "../../providers";
import axios from "axios";
import OwnerBranchFormContent from "@/components/csr/OwnerBranchFormContent";

// Server Component (Root)
export default async function OwnerBranchFormPage({ params }) {
  const { branchId } = params || {};
  const store = makeStore();
  let initialReduxState = {};
  let restaurants = [];
  let cities = [];
  let branchData = null;
  let isAuthenticated = false;

  // Fetch auth data
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
    console.error("Failed to fetch user:", error);
  }

  // Fetch restaurants
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
      cache: "no-store", // Avoid caching for fresh data
    });
    restaurants = response.data.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }

  // Fetch cities
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`, {
      cache: "no-store", // Avoid caching for fresh data
    });
    cities = response.data.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
  }

  // Fetch branch data if branchId is provided (edit mode)
  if (branchId) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${branchId}`, {
        cache: "no-store",
      });
      branchData = response.data.data;
    } catch (error) {
      console.error("Error fetching branch:", error);
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Branch Not Found</h2>
            <p className="text-gray-600 mb-6">The branch you are trying to edit does not exist.</p>
            <a href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  initialReduxState = store.getState();

  // Prepare initial form data
  const hyderabad = cities.find((city) => city.name === "Hyderabad" && city.stateName === "Telangana");
  const initialFormData = branchId
    ? {
        name: "",
        mobile: "",
        email: "",
        password: "",
        restaurantId: branchData.parentRestaurant?._id || "",
        restaurantName: "",
        branchName: branchData.name || "",
        branchAddress: branchData.location?.address || "",
        branchCity: branchData.cityDetails?._id || "",
        branchState: branchData.cityDetails?.stateName || "",
        branchPostalCode: branchData.location?.postalCode || "",
        branchCountry: branchData.cityDetails?.countryName || "India",
        branchCoordinates: branchData.location?.coordinates || [0, 0],
      }
    : {
        name: "",
        mobile: "",
        email: "",
        password: "",
        restaurantId: "",
        restaurantName: "",
        branchName: "",
        branchAddress: "",
        branchCity: hyderabad?._id || "",
        branchState: hyderabad?.stateName || "",
        branchCountry: hyderabad?.countryName || "India",
        branchCoordinates: hyderabad?.coordinates || [0, 0],
      };

  return (
    <Providers initialReduxState={initialReduxState}>
      <OwnerBranchFormContent
        branchId={branchId}
        initialFormData={initialFormData}
        restaurants={restaurants}
        cities={cities}
        isAuthenticated={isAuthenticated}
      />
    </Providers>
  );
}