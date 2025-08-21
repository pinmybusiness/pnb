// components/ui/Loader.js
'use client';

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4  border-dashed rounded-full animate-spin"></div>
    </div>
  );
}
