import { Home, ChevronRight } from "lucide-react";

const API = "https://datacenter.randomstrangerchats.com";
const WEBSITE = "8";

export default async function Breadcrumbs({ parts }) {
  const slug = parts.join("/");

  let breadcrumbs = [];

  try {
    const res = await fetch(
      `${API}/api/get-breadcrumbs-by-slug?slug=${slug}&website=${WEBSITE}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.statusCode === 200 && Array.isArray(data.breadcrumbs)) {
        breadcrumbs = data.breadcrumbs;
      }
    }
  } catch (e) {
    console.error("Breadcrumb API (SSR) error:", e);
  }

  // Fallback
  if (breadcrumbs.length === 0) {
    const slugParts = slug.split("/").filter(Boolean);

    breadcrumbs = slugParts.map((part, index) => ({
      name: part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      url:
        index < slugParts.length - 1
          ? `/${slugParts.slice(0, index + 1).join("/")}`
          : null,
    }));
  }

  return (
    <nav className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home */}
        <li>
          <a
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF5211] transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Home</span>
          </a>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />

              {!isLast && crumb.url ? (
                <a
                  href={crumb.url}
                  className="text-sm text-gray-600 hover:text-[#FF5211] transition-colors capitalize"
                >
                  {crumb.name}
                </a>
              ) : (
                <span className="text-sm font-semibold text-[#FF5211] capitalize">
                  {crumb.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
