import axios from "axios";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Link as LinkIcon,
  Store,
  Navigation,
  ExternalLink,
  Facebook,
  Instagram,
  Globe,
  UtensilsCrossed
} from "lucide-react";
import Image from "next/image";

// Slugify function
const slugify = (str) =>
  str
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "-")
    ?.replace(/[^\w\-]+/g, "")
    ?.replace(/\-\-+/g, "-")
    ?.replace(/^-+|-+$/g, "") || "";

// Function to detect social media platform from URL
const detectSocialPlatform = (url) => {
  if (!url) return null;
  
  if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('zomato.com')) return 'zomato';
  if (url.includes('swiggy.com')) return 'swiggy';
  return 'website';
};

// Platform-specific icons and labels
const platformConfig = {
  facebook: { icon: Facebook, label: "Facebook" },
  instagram: { icon: Instagram, label: "Instagram" },
  zomato: { icon: UtensilsCrossed, label: "Zomato" },
  swiggy: { icon: UtensilsCrossed, label: "Swiggy" },
  website: { icon: Globe, label: "Website" }
};

export default async function BranchInfoPage({ params }) {
  const { city, slug } = params || {};

  let branch = null;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/branches/slug/${slug}`,
      {
        cache: "no-store",
      }
    );
    branch = response.data.data;
  } catch (error) {
    console.error("Error fetching branch:", error);
    return notFound();
  }

  if (!branch) {
    return notFound();
  }

  const branchCitySlug = slugify(branch.location.city?.name || "");
  if (branchCitySlug !== city.toLowerCase()) {
    return notFound();
  }

  const formattedAddress = [
    branch.location.address,
    branch.location.city?.name,
    branch.location.city?.state?.name,
    branch.location.postalCode,
    branch.cityDetails?.countryName || "India",
  ]
    .filter(Boolean)
    .join(", ");

  const mapsUrl = `https://www.google.com/maps?q=${branch.location.coordinates[1]},${branch.location.coordinates[0]}`;
  
  // Detect social platform
  const socialPlatform = branch.socialLink ? detectSocialPlatform(branch.socialLink) : null;
  const PlatformIcon = socialPlatform ? platformConfig[socialPlatform].icon : LinkIcon;
  const platformLabel = socialPlatform ? platformConfig[socialPlatform].label : "Social Link";

  return (
    <div className="min-h-screen bg-[#FFF5EC]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:pt-16">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:justify-between gap-6">
            {/* Logo + Name */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              {branch.parentRestaurant?.logo ? (
                <Image
                  src={branch.parentRestaurant.logo}
                  alt={`${branch.parentRestaurant.name} logo`}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white shadow-lg mx-auto sm:mx-0 sm:mr-6"
                  priority
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg mx-auto sm:mx-0 sm:mr-6">
                  <Store className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="mt-4 sm:mt-0">
                <h1 className="text-2xl sm:text-4xl font-bold">
                  {branch.parentRestaurant?.name}
                </h1>
                <p className="text-sm sm:text-base text-[#696d7d] leading-relaxed">
                  {formattedAddress}
                </p>
              </div>
            </div>

            {/* Directions Button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white text-primary rounded-full hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg"
            >
              <Navigation className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Branch Info */}
        <div className="bg-white shadow-lg rounded-xl p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Store className="h-6 w-6 sm:h-7 sm:w-7 text-primary mr-2 sm:mr-3" />
            Branch Information
          </h2>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="text-base sm:text-lg font-medium text-gray-900">
                  {branch.name}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-primary hover:text-primary-dark text-sm font-semibold transition-colors"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Helpline */}
            {branch.helplineNumber && (
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    Helpline Number
                  </p>
                  <a
                    href={`tel:${branch.helplineNumber}`}
                    className="inline-flex items-center mt-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-300 text-sm sm:text-base font-medium"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {branch.helplineNumber}
                  </a>
                </div>
              </div>
            )}

            {/* Social Link */}
            {branch.socialLink && (
              <div className="flex items-start">
                <PlatformIcon className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {platformLabel}
                  </p>
                  <a
                    href={branch.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-300 text-sm sm:text-base font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit on {platformLabel}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white shadow-lg rounded-xl p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-primary mr-2 sm:mr-3" />
            Find Us
          </h2>
          <div className="relative h-52 sm:h-64 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-[url('/map-placeholder.jpg')] bg-cover bg-center opacity-50">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all duration-300 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg"
              >
                <Navigation className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { city, slug } = params || {};
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/slug/${slug}`);
    const branch = response.data.data;

    const branchCitySlug = slugify(branch.location.city?.name || '');
    if (branchCitySlug !== city.toLowerCase()) {
      return {
        title: 'Branch Not Found | FasterQ.in',
        description: 'The requested branch or city could not be found.',
      };
    }

    return {
      title: `${branch.parentRestaurant?.name}, ${branch.name}, ${branch.location.city?.name} | FasterQ.in`,
      description: `Visit ${branch.name}, a branch of ${branch.parentRestaurant?.name} located in ${branch.location.city?.name}. Address: ${branch.location.address}. Contact: ${branch.helplineNumber || 'Not available'}.`,
    };
  } catch (error) {
    return {
      title: 'Branch Not Found | FasterQ.in',
      description: 'The requested branch or city could not be found.',
    };
  }
}