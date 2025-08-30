// components/ui/Loader.js
'use client';

import { Utensils } from "lucide-react";

export default function Loader({text='Serving your experience...'}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        
        {/* Plate Loader */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Plate outer ring */}
          <div className="absolute inset-0 border-4 border-amber-300 rounded-full animate-spin-slow"></div>
          
          {/* Food Icon */}
          <Utensils className="w-10 h-10 text-amber-600 animate-bounce" />
        </div>

        {/* Text */}
        <p className="text-gray-700 font-medium text-lg animate-pulse">
         {text}
        </p>
      </div>
    </div>
  );
}
