import { Home, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Gradient */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-r from-[#FF5211] via-orange-500 to-orange-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105 group"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#FF5211] border-2 border-[#FF5211]/20 px-8 py-4 rounded-full font-semibold hover:border-[#FF5211] hover:bg-orange-50 transition-all"
          >
            <span>Contact Support</span>
          </a>
        </div>

        {/* Popular Links */}
        {/* <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-4">Popular Pages</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Pricing', href: '/pricing' },
              { label: 'Features', href: '/features' },
              { label: 'Download', href: '/download' },
              { label: 'Blog', href: '/blog' }
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-600 hover:text-[#FF5211] transition-colors p-2 hover:bg-white rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}