'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { ArrowLeft, Package, Calendar, DollarSign, Sparkles, Check, Crown, Zap, TrendingUp, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetail() {
  const { id } = useParams();
  const [plans, setPlans] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, plansRes] = await Promise.all([
          apiClient.get('/api/services'),
          apiClient.get(`/api/services/plans/${id}`)
        ]);
        
        const s = serviceRes.data.data.find(s => s._id === id);
        setService(s);
        setPlans(plansRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getBillingCycleLabel = (cycle) => {
    const labels = {
      1: 'Monthly',
      2: 'Yearly',
      3: 'Quarterly',
      4: 'Trial'
    };
    return labels[cycle] || 'Custom';
  };

  const getBillingCycleColor = (cycle) => {
    const colors = {
      1: 'from-blue-500 to-blue-600',
      2: 'from-purple-500 to-purple-600',
      3: 'from-green-500 to-green-600',
      4: 'from-orange-500 to-orange-600'
    };
    return colors[cycle] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF5211] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-[#FF5211]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h3>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link
            href="/dashboard/services"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/services"
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-[#FF5211] group-hover:-translate-x-1 transition-all duration-300" />
            </Link>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                <p className="text-sm text-gray-600">Available pricing plans</p>
              </div>
            </div>

            <Link
              href="/dashboard/services/plan/add"
              className="hidden md:flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Add New Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Description Card */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl border-2 border-orange-100 p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8 text-[#FF5211]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">About This Service</h2>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
              {service.isAddon && (
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-4 h-4" />
                  Premium Addon Service
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-[#FF5211]" />
              Available Plans
            </h2>
            <span className="px-4 py-2 bg-orange-100 text-[#FF5211] font-bold text-sm rounded-xl">
              {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-16 bg-white/80 rounded-2xl border-2 border-orange-100">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-[#FF5211]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Plans Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This service doesn't have any pricing plans yet. Create one to get started!
              </p>
              <Link
                href="/dashboard/services/plan/add"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/30"
              >
                <Sparkles className="w-4 h-4" />
                Create First Plan
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan._id}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden"
                >
                  {/* Popular Badge for first plan */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/50">
                        <Crown className="w-3 h-3" />
                        Popular
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 via-orange-500/0 to-orange-600/0 group-hover:from-[#FF5211]/5 group-hover:via-orange-500/3 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF5211] transition-colors duration-300">
                          {plan.name}
                        </h3>
                        <Link
                          href={`/dashboard/services/plan/edit/${plan._id}`}
                          className="w-8 h-8 flex items-center justify-center bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
                          title="Edit plan"
                        >
                          <Pencil className="w-4 h-4 text-[#FF5211]" />
                        </Link>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{plan.price || 0}
                        </span>
                        {plan.billing_cycle === 4 && (
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full">
                            FREE
                          </span>
                        )}
                      </div>

                      {/* Billing Cycle Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getBillingCycleColor(plan.billing_cycle)} text-white text-sm font-bold rounded-xl shadow-lg`}>
                        <Calendar className="w-4 h-4" />
                        {getBillingCycleLabel(plan.billing_cycle)}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-[#FF5211]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Duration</p>
                        <p className="text-lg font-bold text-gray-900">{plan.durationDays} Days</p>
                      </div>
                    </div>

                    {/* Features */}
                    {plan.features && plan.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#FF5211]" />
                          Features Included
                        </h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-green-600" />
                              </div>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Button */}
                    {/* <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 group/btn"
                    >
                      <DollarSign className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      Select Plan
                    </button> */}
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-tr-full transform -translate-x-16 translate-y-16 group-hover:-translate-x-12 group-hover:translate-y-12 transition-transform duration-500"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Add Plan Button */}
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <Link
            href="/dashboard/services/plan/add"
            className="flex items-center justify-center gap-2 w-14 h-14 text-white bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-full shadow-2xl shadow-orange-500/40 hover:scale-110 transition-all duration-300"
          >
            <Sparkles className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}