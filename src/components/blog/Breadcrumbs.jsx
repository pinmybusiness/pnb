"use client";

import { useState, useEffect } from "react";
import { Home, ChevronRight, Clock, User, Calendar, Share2, Bookmark, Tag } from "lucide-react";

// Breadcrumbs Component
export default function Breadcrumbs({ parts }) {
  let link = "";

  return (
    <nav className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#FF5211] transition-colors group">
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Home</span>
          </a>
        </li>

        {parts.map((p, i) => {
          link += "/" + p;
          const isLast = i === parts.length - 1;
          const name = p.replace(/-/g, " ");

          return (
            <li key={i} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {!isLast ? (
                <a 
                  href={link} 
                  className="text-sm text-gray-600 hover:text-[#FF5211] transition-colors capitalize"
                >
                  {name}
                </a>
              ) : (
                <span className="text-sm font-semibold text-[#FF5211] capitalize">{name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}