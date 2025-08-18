"use client";

import { ArrowLeft, Check, Crown, BarChart3, MessageSquare, Brain, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState('monthly'); // Removed TypeScript type

  const PlanCard = ({
    title,
    monthlyPrice,
    annualPrice,
    description,
    features,
    cta,
    popular = false,
    highlight = false
  }) => {
    const currentPrice = billingCycle === 'monthly' ? monthlyPrice : annualPrice;
    const savings = billingCycle === 'annual' ? Math.round(((monthlyPrice * 12) - annualPrice) / (monthlyPrice * 12) * 100) : 0;

    return (
      <div className={`relative border rounded-2xl p-6 shadow-sm ${highlight ? 'border-primary bg-primary/5' : 'border-soft'}`}>
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              Best Value
            </div>
          </div>
        )}
        
        <div className="text-center pb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">
              ₹{currentPrice.toLocaleString()}
              <span className="text-lg text-gray-500 font-normal">/month</span>
            </div>
            {billingCycle === 'annual' && savings > 0 && (
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-block">
                Save {savings}% annually
              </div>
            )}
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            className={`w-full py-3 rounded-lg font-medium ${highlight ? 'bg-primary hover:bg-primary-dark text-white' : 'border border-primary text-primary hover:bg-primary/5'}`}
          >
            {cta}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-light">
     <Header activeLink="/pricing" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your restaurant's needs. Start with Manual Mode or unlock AI-powered automation.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-xl border border-soft shadow-sm inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium ${billingCycle === 'monthly' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${billingCycle === 'annual' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Annual
              <span className={`text-xs bg-primary/20  px-2 py-0.5 rounded-full  ${billingCycle === 'annual' ? 'text-white' : 'text-primary'}`}>
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <PlanCard
            title="Manual Mode"
            monthlyPrice={499}
            annualPrice={4990}
            description="Essential tools for basic restaurant management"
            features={[
              "Manual waiting list updates",
              "Customer stats dashboard",
              "Basic analytics (day/week/month)",
              "WhatsApp notifications",
              "Email updates",
              "Logo & branding customization",
              "Upload restaurant logo",
              "Change theme colors"
            ]}
            cta="Get Started"
          />

          <PlanCard
            title="AI Mode"
            monthlyPrice={1499}
            annualPrice={14990}
            description="Intelligent automation for modern restaurants"
            features={[
              "All Manual Mode features",
              "AI-driven queue management",
              "AI-based revenue predictions",
              "Smart customer reminders",
              "Intelligent wait time estimation",
              "Automated customer flow",
              "Predictive analytics",
              "Priority support"
            ]}
            cta="Start Free Trial"
            popular={true}
            highlight={true}
          />
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl border border-soft shadow-sm p-8 max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Feature Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive reports and real-time data visualization for both plans
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Communication</h3>
              <p className="text-gray-600 text-sm">
                WhatsApp and email notifications included in both plans
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Automation</h3>
              <p className="text-gray-600 text-sm">
                Exclusive to AI Mode - intelligent predictions and automation
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time."
              },
              {
                question: "Is there a free trial?",
                answer: "AI Mode comes with a 14-day free trial. Manual Mode has no trial but offers a 30-day money-back guarantee."
              },
              {
                question: "How does the annual billing work?",
                answer: "Annual billing gives you 2 months free compared to monthly billing. You'll be charged once per year."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white border border-soft rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-gray-900">{item.question}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}