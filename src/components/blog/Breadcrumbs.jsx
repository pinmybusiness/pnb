"use client";

import { useState, useEffect } from "react";
import { Home, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BLOG_BASE_URL;
const WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_ID;

export default function Breadcrumbs({ parts }) {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      try {
        const slug = parts.join("/");
        const response = await fetch(
          `${API}/api/get-breadcrumbs-by-slug?slug=${slug}&website=${WEBSITE}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.statusCode === 200 && data.breadcrumbs && data.breadcrumbs.length > 0) {
            // Use custom breadcrumbs from database
            setBreadcrumbs(data.breadcrumbs);
          } else {
            // Fallback to URL-based breadcrumbs
            generateBreadcrumbsFromSlug(slug);
          }
        } else {
          // Fallback on API error
          generateBreadcrumbsFromSlug(slug);
        }
      } catch (error) {
        console.error('Error fetching breadcrumbs:', error);
        // Fallback on network error
        generateBreadcrumbsFromSlug(parts.join("/"));
      } finally {
        setLoading(false);
      }
    };

    const generateBreadcrumbsFromSlug = (slug) => {
      const slugParts = slug.split('/').filter(Boolean);
      const generatedBreadcrumbs = slugParts.map((part, index) => {
        const url = `/${slugParts.slice(0, index + 1).join('/')}`;
        const isLast = index === slugParts.length - 1;
        
        return {
          name: part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          url: isLast ? null : url,
          order: index + 1
        };
      });
      
      setBreadcrumbs(generatedBreadcrumbs);
    };

    fetchBreadcrumbs();
  }, [parts]);

  // Loading state
  if (loading) {
    return (
      <nav className="mb-6">
        <ol className="flex items-center gap-2 flex-wrap">
          <li className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Loading...</span>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home Link */}
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
            <li key={crumb.order || index} className="flex items-center gap-2">
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