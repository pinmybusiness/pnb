"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BLOG_BASE_URL;
const WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_ID;

export default function Sidebar({ slug }) {
  const category = slug.split("/")[0];
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/get-website-articles-slug?website=${WEBSITE}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d?.posts) return;

        const related = d.posts.filter((p) =>
          p.slug.startsWith(category + "/")
        );

        const final = related.map((p) => ({
          slug: p.slug,
          title: p.slug.split("/").pop().replace(/-/g, " "),
        }));

        setItems(final);
      });
  }, [slug]);

  if (!items.length) return null;

  return (
<div className="space-y-6">
      {/* Related Articles */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#FF5211]" />
          Related Articles
        </h3>

        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.slug}>
              <a
                href={`/${it.slug}`}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-all"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-[#FF5211] rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                <span className="text-sm text-gray-700 group-hover:text-[#FF5211] transition-colors leading-relaxed">
                  {it.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
        <p className="text-sm text-white/90 mb-4">Get the latest tips and insights delivered to your inbox.</p>
        <button className="w-full bg-white text-[#FF5211] py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
          Subscribe Now
        </button>
      </div>
    </div>
  );
}
