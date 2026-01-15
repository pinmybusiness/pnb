'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Package, Plus, Sparkles, ArrowRight, Layers, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient.get('/api/services');
        setServices(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF5211] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className=" sticky top-0 z-40">
        <div className="max-w-7xl mx-auto lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
                  <p className="text-sm text-gray-600 mt-0.5">Manage and explore all your services</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/services/add"
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Add Service
              </Link>
              
              <Link
                href="/dashboard/services/plan/add"
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl transition-all duration-300 hover:shadow-lg group"
              >
                <Layers className="w-4 h-4 text-[#FF5211] group-hover:scale-110 transition-transform duration-300" />
                Add Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-[#FF5211]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first service and unlock the power of your dashboard.
            </p>
            <Link
              href="/dashboard/services/add"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/30"
            >
              <Plus className="w-4 h-4" />
              Create First Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 via-orange-500/0 to-orange-600/0 group-hover:from-[#FF5211]/5 group-hover:via-orange-500/3 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-7 h-7 text-[#FF5211]" />
                    </div>
                    
                    {service.isAddon && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-3 h-3" />
                        Addon
                      </div>
                    )}
                  </div>

                  {/* Service Info */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF5211] transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => window.location.href = `/dashboard/services/${service._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 group/btn"
                  >
                    View Plans
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}