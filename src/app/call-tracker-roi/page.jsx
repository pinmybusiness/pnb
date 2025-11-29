'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Phone, Target, Zap, CheckCircle2, ArrowRight, Sparkles, Award, BarChart3 } from 'lucide-react';

const NumberInput = ({ label, name, value, suffix, onChange, icon: Icon, description }) => (
  <div className="group">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      {Icon && (
        <div className="w-7 h-7 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
          <Icon className="w-3.5 h-3.5 text-[#FF5211]" />
        </div>
      )}
      <span>{label}</span>
    </label>
    {description && (
      <p className="text-xs text-gray-500 mb-2 ml-9">{description}</p>
    )}
    <div className="relative flex items-center">
      <input
        type="number"
        name={name}
        value={Number.isNaN(value) ? '' : value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-semibold pr-12"
      />
      {suffix && (
        <span className="absolute right-4 text-sm font-bold text-gray-500">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default function CallTrackerRoiPage() {
  const [monthlyCalls, setMonthlyCalls] = useState(500);
  const [avgProfitPerSale, setAvgProfitPerSale] = useState(50);
  const [conversionRate, setConversionRate] = useState(50);
  const [missedRateNow, setMissedRateNow] = useState(30);
  const [missedRateWithFasterQ, setMissedRateWithFasterQ] = useState(5);
  const [fasterQMonthlyCost, setFasterQMonthlyCost] = useState(83.25);

  // Calculations
  const missedBefore = (monthlyCalls * missedRateNow) / 100;
  const missedAfter = (monthlyCalls * missedRateWithFasterQ) / 100;
  const recoveredCalls = Math.max(missedBefore - missedAfter, 0);
  const recoveredSales = (recoveredCalls * conversionRate) / 100;
  const recoveredProfitMonth = recoveredSales * avgProfitPerSale;
  const recoveredProfitYear = recoveredProfitMonth * 12;

  const fasterQCostYear = fasterQMonthlyCost * 12;
  const netProfitYear = recoveredProfitYear - fasterQCostYear;
  const roiPercent = fasterQCostYear > 0 ? (netProfitYear / fasterQCostYear) * 100 : 0;

  const formatMoney = (n) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const formatPct = (n) => `${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}%`;

  const handleNumberChange = (setter) => (e) => {
    setter(parseFloat(e.target.value) || 0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 -mt-5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-full mb-6 shadow-lg shadow-orange-500/30">
            <Calculator className="w-4 h-4" />
            ROI Calculator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-600">Revenue Recovery</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See exactly how much money you're losing to missed calls — and how FasterQ can help you recover it
          </p>
        </div>

        {/* Stats Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-6 text-center hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{recoveredCalls.toFixed(0)}</h3>
            <p className="text-sm font-medium text-gray-600">Calls Recovered Monthly</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-6 text-center hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatMoney(recoveredProfitYear)}</h3>
            <p className="text-sm font-medium text-gray-600">Annual Revenue Recovery</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-6 text-center hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-600 mb-2">{formatPct(roiPercent)}</h3>
            <p className="text-sm font-medium text-gray-600">Return on Investment</p>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
          
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Your Business Metrics</h2>
                    <p className="text-sm text-white/90">Enter your data to see personalized results</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <NumberInput
                  label="Monthly Inbound Calls"
                  name="monthlyCalls"
                  value={monthlyCalls}
                  onChange={handleNumberChange(setMonthlyCalls)}
                  icon={Phone}
                  description="How many customer calls do you receive monthly?"
                />
                
                <NumberInput
                  label="Average Profit Per Sale"
                  name="avgProfitPerSale"
                  value={avgProfitPerSale}
                  suffix="₹"
                  onChange={handleNumberChange(setAvgProfitPerSale)}
                  icon={DollarSign}
                  description="Average profit you make from each sale"
                />
                
                <NumberInput
                  label="Lead-to-Sale Conversion Rate"
                  name="conversionRate"
                  value={conversionRate}
                  suffix="%"
                  onChange={handleNumberChange(setConversionRate)}
                  icon={TrendingUp}
                  description="What % of leads convert to paying customers?"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-gray-100">
                  <NumberInput
                    label="Current Missed Call Rate"
                    name="missedRateNow"
                    value={missedRateNow}
                    suffix="%"
                    onChange={handleNumberChange(setMissedRateNow)}
                    icon={Phone}
                  />
                  
                  <NumberInput
                    label="With FasterQ"
                    name="missedRateWithFasterQ"
                    value={missedRateWithFasterQ}
                    suffix="%"
                    onChange={handleNumberChange(setMissedRateWithFasterQ)}
                    icon={Zap}
                  />
                </div>
                
                <NumberInput
                  label="FasterQ Monthly Cost (per number)"
                  name="fasterQMonthlyCost"
                  value={fasterQMonthlyCost}
                  suffix="₹"
                  onChange={handleNumberChange(setFasterQMonthlyCost)}
                  icon={DollarSign}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            
            {/* Monthly Breakdown */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Monthly Breakdown</h2>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border border-red-200">
                  <span className="text-sm font-semibold text-gray-700">Missed Calls Now</span>
                  <span className="text-xl font-bold text-red-600">{missedBefore.toFixed(0)}</span>
                </div>
                
                <div className="flex items-center justify-center py-2">
                  <ArrowRight className="w-6 h-6 text-[#FF5211] animate-pulse" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200">
                  <span className="text-sm font-semibold text-gray-700">With FasterQ</span>
                  <span className="text-xl font-bold text-green-600">{missedAfter.toFixed(0)}</span>
                </div>
                
                <div className="pt-3 mt-3 border-t-2 border-gray-100">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200 mb-3">
                    <span className="text-sm font-semibold text-gray-700">Recovered Calls</span>
                    <span className="text-xl font-bold text-[#FF5211]">{recoveredCalls.toFixed(0)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                    <span className="text-sm font-semibold text-gray-700">New Sales</span>
                    <span className="text-xl font-bold text-blue-600">{recoveredSales.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Card */}
            <div className="bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl shadow-2xl shadow-orange-500/40 overflow-hidden">
              <div className="p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Annual Impact</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="text-sm font-medium">Revenue Recovery</span>
                    <span className="text-lg font-bold">{formatMoney(recoveredProfitYear)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="text-sm font-medium">FasterQ Cost</span>
                    <span className="text-lg font-bold">{formatMoney(fasterQCostYear)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="text-sm font-medium">Net Profit</span>
                    <span className="text-lg font-bold">{formatMoney(netProfitYear)}</span>
                  </div>
                  
                  <div className="mt-6 p-6 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8" />
                        <span className="text-lg font-bold">Total ROI</span>
                      </div>
                      <span className="text-5xl font-black">{formatPct(roiPercent)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-white to-orange-50 rounded-3xl border-2 border-orange-100 p-8 md:p-12 text-center shadow-xl">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Recover Your Lost Revenue?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join hundreds of businesses already maximizing their call conversion with FasterQ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/call-tracker"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed">
            *This calculator provides estimates for illustration purposes only. Actual results may vary based on your industry, team performance, call quality, and other business-specific factors. Individual outcomes depend on various factors unique to your business operations.
          </p>
        </div>
      </div>
    </main>
  );
}