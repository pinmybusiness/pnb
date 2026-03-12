"use client";

import TestimonialsSection from "@/components/home/Testimonials";
import { Check, Crown, Zap, Users, Shield, Star, ArrowRight, Phone, Mic, Database, Globe, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Reusable PackagePricing Component
const PackagePricing = ({ billingCycle }) => {
  const [selectedFeatures, setSelectedFeatures] = useState({
    callMonitoring: true, // Always true as it's base
    extendedStorage: false,
    crmIntegration: false,
  });

  const prices = {
    quarterly: {
      callMonitoring: 447,
      extendedStorage: 99,
      crmIntegration: 99,
    },
    yearly: {
      callMonitoring: 1188,
      extendedStorage: 499,
      crmIntegration: 499,
    },
  };

  const currentPrices = prices[billingCycle];

  const calculateTotal = () => {
    let total = currentPrices.callMonitoring;
    if (selectedFeatures.extendedStorage) total += currentPrices.extendedStorage;
    if (selectedFeatures.crmIntegration) total += currentPrices.crmIntegration;
    return total;
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="bg-gradient-to-r from-[#FF5211]/5 to-orange-100/30 rounded-3xl p-8 md:p-12 border-2 border-[#FF5211]/20">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
        Complete Package Pricing
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#FF5211]/20">
              <th className="text-left py-4 px-4 font-bold text-gray-900">Component</th>
              <th className="text-center py-4 px-4 font-bold text-gray-900">
                {billingCycle === "quarterly" ? "Quarterly (per user)" : "Yearly (per user)"}
              </th>
              <th className="text-center py-4 px-4 font-bold text-gray-900">Include</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Call Monitoring - Always included */}
            <tr className="hover:bg-white/50 transition-colors bg-green-50/30">
              <td className="py-4 px-4 font-medium text-gray-900">
                Call Monitoring
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Base Plan</span>
              </td>
              <td className="text-center py-4 px-4 text-[#FF5211] font-bold">₹{currentPrices.callMonitoring}</td>
              <td className="text-center py-4 px-4">
                <div className="flex justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </td>
            </tr>

            {/* Call Recording - Free */}
            <tr className="hover:bg-white/50 transition-colors">
              <td className="py-4 px-4 font-medium text-gray-900">
                Call Recording
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free</span>
              </td>
              <td className="text-center py-4 px-4 text-gray-600">₹0 (30 days storage)</td>
              <td className="text-center py-4 px-4">
                <div className="flex justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-50">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </td>
            </tr>

            {/* Extended Storage - Optional */}
            <tr className="hover:bg-white/50 transition-colors">
              <td className="py-4 px-4 font-medium text-gray-900 pl-8 text-sm">
                └ Extended Storage (beyond 30 days)
              </td>
              <td className="text-center py-4 px-4 text-gray-600">₹{currentPrices.extendedStorage}</td>
              <td className="text-center py-4 px-4">
                <button
                  onClick={() => toggleFeature('extendedStorage')}
                  className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                    selectedFeatures.extendedStorage
                      ? 'bg-[#FF5211] border-[#FF5211] hover:bg-[#FF5211]/80'
                      : 'border-gray-300 hover:border-[#FF5211] bg-white'
                  }`}
                >
                  {selectedFeatures.extendedStorage && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              </td>
            </tr>

            {/* CRM Integration - Optional */}
            <tr className="hover:bg-white/50 transition-colors">
              <td className="py-4 px-4 font-medium text-gray-900">CRM/API Integration</td>
              <td className="text-center py-4 px-4 text-gray-600">₹{currentPrices.crmIntegration}</td>
              <td className="text-center py-4 px-4">
                <button
                  onClick={() => toggleFeature('crmIntegration')}
                  className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                    selectedFeatures.crmIntegration
                      ? 'bg-[#FF5211] border-[#FF5211] hover:bg-[#FF5211]/80'
                      : 'border-gray-300 hover:border-[#FF5211] bg-white'
                  }`}
                >
                  {selectedFeatures.crmIntegration && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              </td>
            </tr>

            {/* Total */}
            <tr className="bg-[#FF5211]/5 font-bold">
              <td className="py-4 px-4 text-gray-900">
                Total per User
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({selectedFeatures.extendedStorage ? 'with' : 'without'} extended storage, {selectedFeatures.crmIntegration ? 'with' : 'without'} CRM)
                </span>
              </td>
              <td className="text-center py-4 px-4 text-[#FF5211] text-xl">
                ₹{calculateTotal()}
              </td>
              <td className="text-center py-4 px-4"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info Boxes */}
      <div className="mt-6 space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span className="font-medium">Recording is free!</span> You only pay for storage if you need to keep recordings longer than 30 days.
          </p>
        </div>
        
        {selectedFeatures.extendedStorage || selectedFeatures.crmIntegration ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <span className="font-medium">Selected Package:</span>
              Call Monitoring 
              {selectedFeatures.extendedStorage && ' + Extended Storage'}
              {selectedFeatures.crmIntegration && ' + CRM Integration'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Add-on Card Component
const AddonCard = ({
  title,
  quarterlyPrice,
  yearlyPrice,
  description,
  features,
  icon: Icon,
  billingCycle,
}) => {
  const router = useRouter();
  const currentPrice = billingCycle === "quarterly" ? quarterlyPrice : yearlyPrice;
  
  return (
    <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#FF5211]/30 hover:shadow-xl transition-all duration-300 group w-full">
      <div className="absolute top-4 right-4">
        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
          Add-on
        </span>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-[#FF5211]" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-gray-600 text-lg">₹</span>
          <span className="text-2xl font-bold text-[#FF5211]">{currentPrice}</span>
          <span className="text-sm text-gray-500">/{billingCycle === "quarterly" ? "quarter" : "year"}</span>
        </div>
        
        <ul className="space-y-2 mb-4">
          {features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <Plus className="w-3 h-3 text-[#FF5211] flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => router.push("/contact")}
          className="w-full py-2.5 rounded-full text-sm font-semibold bg-gray-50 text-[#FF5211] border-2 border-[#FF5211]/20 hover:border-[#FF5211] hover:bg-[#FF5211] hover:text-white transition-all duration-300"
        >
          Add to Plan
        </button>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("yearly");
  const router = useRouter();

  const PlanCard = ({
    title,
    quarterlyPrice,
    yearlyPrice,
    description,
    features,
    cta,
    popular = false,
    icon: Icon,
    note,
  }) => {
    const currentPrice = billingCycle === "quarterly" ? quarterlyPrice : yearlyPrice;
    
    const monthlyPrice = billingCycle === "yearly" 
      ? Math.round(yearlyPrice / 12) 
      : Math.round(quarterlyPrice / 3);
    
    const savings = billingCycle === "yearly" && quarterlyPrice
      ? Math.round(((quarterlyPrice * 4 - yearlyPrice) / (quarterlyPrice * 4)) * 100)
      : 0;

    return (
      <div
        className={`relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border-2 ${
          popular
            ? "border-[#FF5211] shadow-xl"
            : "border-gray-100 shadow-lg hover:-translate-y-2"
        } group w-full`}
      >
        {popular && (
          <div className="absolute -top-4 min-w-[150px] left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
              <Crown className="w-4 h-4" />
              Most Popular
            </div>
          </div>
        )}

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>

        <div className="relative">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            {Icon && (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-2xl mb-4 mx-auto">
                <Icon className="w-10 h-10 text-[#FF5211]" />
              </div>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h3>

            {/* Price with monthly highlighted */}
            <div className="mb-4">
              {/* Monthly price - Large and prominent */}
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-gray-600 text-3xl">₹</span>
                <span className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
                  {monthlyPrice}
                </span>
                <span className="text-2xl text-gray-500 ml-2">/month</span>
              </div>
              
              {/* Yearly price - Smaller below */}
              <div className="text-gray-500 mb-3">
                <span className="text-lg">₹{currentPrice}</span>
                <span className="text-sm">/{billingCycle === "quarterly" ? "quarter" : "year"}</span>
                {billingCycle === "yearly" && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Save {savings}%
                  </span>
                )}
              </div>

              {note && (
                <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg inline-block mt-3 font-medium">
                  {note}
                </div>
              )}
            </div>

            <p className="text-gray-600 text-base leading-relaxed">{description}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-gray-700 group/item">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 group-hover/item:scale-110 transition-transform shadow-sm">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="flex-1 text-left">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/contact")}
            className={`w-full py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 text-lg ${
              popular
                ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white"
                : "bg-gray-50 text-[#FF5211] border-2 border-[#FF5211]/20 hover:border-[#FF5211] hover:bg-[#FF5211] hover:text-white"
            }`}
          >
            {cta}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Accent */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent ${
            popular ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } transition-opacity duration-500 rounded-b-3xl`}
        ></div>
      </div>
    );
  };

  // Refund Policy Component
  const RefundPolicy = () => (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#FF5211]/30 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-lg flex items-center justify-center">
          <span className="text-[#FF5211] font-bold">₹</span>
        </span>
        <h3 className="font-bold text-lg text-gray-900">Refund Policy</h3>
      </div>
      
      {/* Yearly only badge */}
      <div className="mb-4 inline-block px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
        <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Available for Yearly Plans Only
        </span>
      </div>

      <div className="space-y-3 text-gray-600">
        <p className="flex items-start gap-2">
          <span className="text-[#FF5211] font-bold">•</span>
          <span>Less than one month - 90% refund</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-[#FF5211] font-bold">•</span>
          <span>Between 2 months and 3 months - 60% refund</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-[#FF5211] font-bold">•</span>
          <span>More than 3 months - No refund</span>
        </p>
        <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-xl mt-2">
          <span className="font-bold">Note:</span> Refunds apply only to Call Monitoring on yearly plans. 
          Other payments and add-ons are non-refundable.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            💰 Transparent Pricing
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
            Simple, Flexible Plans for
            <br />
            <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
              Every Business Need
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start with Call Monitoring and add features as you grow
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="bg-white p-1.5 rounded-full border-2 border-gray-200 shadow-lg inline-flex">
            <button
              onClick={() => setBillingCycle("quarterly")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all ${
                billingCycle === "quarterly"
                  ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Yearly
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  billingCycle === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                Save 34%
              </span>
            </button>
          </div>
        </div>

        {/* Two Column Layout - Plan on Left, Add-ons on Right */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch mb-16">
          {/* Left Column - Main Plan */}
          <div className="lg:w-[600px]">
            <PlanCard
              title="Call Monitoring"
              quarterlyPrice={447}
              yearlyPrice={1188}
              description="Track and analyze all business calls with real-time insights. The complete solution for call tracking and team performance monitoring."
              icon={Phone}
              features={[
                "Automatic tracking for all SIM calls",
                "Performance insights for each agent",
                "Missed call follow-up tracking",
                "Call analytics and trend reports",
                "Daily WhatsApp summary for managers",
                "Unlimited call log history",
                "Android app for on-device tracking",
                "Export data to CSV/Excel",
              ]}
              cta="Start Monitoring Now"
              popular={true}
            />
          </div>

          {/* Right Column - Add-ons Stacked */}
          <div className="lg:w-[400px] flex flex-col gap-6">
            <div className="text-left mb-2">
              <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                Optional Add-ons
              </span>
            </div>
            
            {/* Call Recording Add-on */}
            <AddonCard
              title="Call Recording"
              quarterlyPrice={0}
              yearlyPrice={0}
              description="Record every call for quality control and training."
              icon={Mic}
              features={[
                "Dual-side call recordings",
                "30 days recording storage included",
                "Playback directly from dashboard",
                "Download recordings anytime",
                "Useful for training and audits",
                "Real-time coaching support",
              ]}
              billingCycle={billingCycle}
            />

            {/* CRM Integration Add-on */}
            <AddonCard
              title="CRM Integration"
              quarterlyPrice={99}
              yearlyPrice={499}
              description="Sync call data automatically with your CRM."
              icon={Globe}
              features={[
                "Zoho CRM integration",
                "HubSpot integration",
                "LeadSquared & Dynamics support",
                "Auto-create leads from calls",
                "API access for custom integrations",
                "Real-time CRM updates",
              ]}
              billingCycle={billingCycle}
            />

            {/* Extended Storage Note */}
            <div className="mt-2 text-sm text-gray-500 bg-white/80 rounded-xl p-4 border border-gray-200">
              <span className="font-medium text-[#FF5211]">Extended storage:</span> Beyond 30 days at ₹99/quarter or ₹499/year
            </div>
          </div>
        </div>

        {/* Package Pricing Component */}
        <div className="mb-16 md:mb-20">
          <PackagePricing billingCycle={billingCycle} />
        </div>

        {/* Trust Section */}
        <div className="mb-16 md:mb-20">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="grid md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[{ icon: Users, stat: "1,000+", label: "Active Teams" },
                { icon: Zap, stat: "98%", label: "Uptime SLA" },
                { icon: Shield, stat: "Bank-Level", label: "Security" },
                { icon: Star, stat: "4.9/5", label: "Customer Rating" },
              ].map((item, i) => (
                <div key={i} className="text-center pt-6 md:pt-0 first:pt-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl mb-3">
                    <item.icon className="w-6 h-6 text-[#FF5211]" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent mb-1">
                    {item.stat}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TestimonialsSection />

        {/* FAQ and Refund Policy */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
          <div className="md:col-span-2">
            <div className="text-center mb-8">
              <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
                ❓ Got Questions?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {[{
                  q: "Is call recording really free?",
                  a: "Yes! Call recording is completely free. You only pay for storage if you need to keep recordings longer than 30 days. The first 30 days of storage are always included at no cost.",
                },
                {
                  q: "How does recording storage work?",
                  a: "All recordings are stored for 30 days free. If you need to keep recordings longer, you can add extended storage for ₹99/quarter or ₹499/year. You can access and download any recording during this period.",
                },
                {
                  q: "What's included in Call Monitoring?",
                  a: "Call Monitoring includes auto-tracking for SIM calls, analytics dashboard, individual rep performance tracking, daily WhatsApp reports, and unlimited call logging.",
                },
                {
                  q: "What are the quarterly prices?",
                  a: "Call Monitoring is ₹447/quarter, Call Recording is free with optional ₹99/quarter for extended storage, and CRM Integration is ₹99/quarter.",
                },
                {
                  q: "Can I add CRM features later?",
                  a: "Yes! You can add CRM Integration at any time from your dashboard. It will be prorated for the remainder of your billing cycle.",
                },
                {
                  q: "Is there a minimum team size?",
                  a: "No minimum team size. You can start with as few as 1 user and add more as your team grows.",
                },
                {
                  q: "How do refunds work for yearly plans?",
                  a: "For yearly Call Monitoring plans: 90% refund within first month, 60% refund between 2-3 months, no refund after 3 months. Refunds don't apply to quarterly plans or add-ons.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#FF5211]/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[#FF5211] font-bold text-lg">Q</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#FF5211] transition-colors">
                        {faq.q}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>

                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-5 h-5 text-[#FF5211]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Policy Sidebar */}
          <div>
            <RefundPolicy />
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-8 border border-[#FF5211]/20">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Need a custom plan for your team?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact us for volume discounts and enterprise requirements
          </p>
          <a
            onClick={() => router.push("/contact")}
            className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white font-bold hover:shadow-xl transition-all"
          >
            Contact Sales
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
} 