import { Home, ChevronRight } from "lucide-react";

const API =  'https://datacenter.randomstrangerchats.com';
const WEBSITE =  '8';

export default async function Breadcrumbs({ parts }) {
  const slug = parts.join("/");

  let breadcrumbs = [];

  // ---- FETCH FROM API (SSR) ----
  try {
    const res = await fetch(
      `${API}/api/get-breadcrumbs-by-slug?slug=${slug}&website=${WEBSITE}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();

      if (data.statusCode === 200 && data.breadcrumbs?.length > 0) {
        breadcrumbs = data.breadcrumbs;
      }
    }
  } catch (e) {
    console.error("Breadcrumb API (SSR) error:", e);
  }

  // ---- FALLBACK: Generate URL-based breadcrumbs ----
  if (breadcrumbs.length === 0) {
    const slugParts = slug.split("/").filter(Boolean);

    breadcrumbs = slugParts.map((part, index) => {
      const url = `/${slugParts.slice(0, index + 1).join("/")}`;
      const isLast = index === slugParts.length - 1;

      return {
        name: part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        url: isLast ? null : url,
      };
    });
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

        {/* Dynamic Breadcrumbs */}
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
