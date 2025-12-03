"use client";

import { useState } from "react";
import {
  Phone,
  DollarSign,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const NumberInput = ({
  label,
  value,
  suffix,
  onChange,
  icon: Icon,
  description,
}) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4 text-[#FF5211]" />} {label}
    </label>

    {description && (
      <p className="text-xs text-gray-500 ml-6">{description}</p>
    )}

    <div className="relative">
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:border-[#FF5211] focus:ring-[#FF5211]/20 transition text-gray-900 text-sm"
      />
      {suffix && (
        <span className="absolute right-3 top-2.5 text-sm text-gray-500 font-semibold">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default function RoiCalculatorClient() {
  const [monthlyCalls, setMonthlyCalls] = useState();
  const [avgProfitPerSale, setAvgProfitPerSale] = useState();
  const [conversionRate, setConversionRate] = useState();
  const [missedRateNow, setMissedRateNow] = useState();
  const [missedRateWithFasterQ, setMissedRateWithFasterQ] = useState();
  const [fasterQMonthlyCost, setFasterQMonthlyCost] = useState();

  // Safe wrapper for all outputs
  const safe = (n) => (isNaN(n) ? "-" : n);

  // Calculations
  const missedBefore = (monthlyCalls * missedRateNow) / 100;
  const missedAfter = (monthlyCalls * missedRateWithFasterQ) / 100;
  const recoveredCalls = Math.max(missedBefore - missedAfter, 0);

  const recoveredSales = (recoveredCalls * conversionRate) / 100;
  const recoveredProfitMonth = recoveredSales * avgProfitPerSale;
  const recoveredProfitYear = recoveredProfitMonth * 12;

  const fasterQCostYear = fasterQMonthlyCost * 12;
  const netProfitYear = recoveredProfitYear - fasterQCostYear;

  const roiPercent =
    fasterQCostYear > 0 ? (netProfitYear / fasterQCostYear) * 100 : 0;

  const barData = [
    { label: "Missed Calls Now", value: isNaN(missedBefore) ? 0 : missedBefore },
    { label: "With FasterQ", value: isNaN(missedAfter) ? 0 : missedAfter },
  ];

  const lineData = [
    { month: "Now", profit: 0 },
    {
      month: "With FasterQ",
      profit: isNaN(recoveredProfitYear) ? 0 : recoveredProfitYear,
    },
  ];

  const formatMoney = (n) =>
    isNaN(n)
      ? "-"
      : `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const formatPct = (n) =>
    isNaN(n)
      ? "-"
      : `${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}%`;

  const handle = (setter) => (e) =>
    setter(parseFloat(e.target.value) || 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">

      {/* ===================== TOP STATS ===================== */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 border border-gray-400 rounded-xl bg-white">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#FF5211]"/> Calls Recovered (Monthly)
          </p>
          <h3 className="text-2xl font-bold">
            {safe(recoveredCalls.toFixed(0))}
          </h3>
        </div>

        <div className="p-4 border border-gray-400 rounded-xl bg-white">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#FF5211]" /> Annual Revenue Recovery
          </p>
          <h3 className="text-2xl font-bold">
            {safe(formatMoney(recoveredProfitYear))}
          </h3>
        </div>

        <div className="p-4 border border-gray-400 rounded-xl bg-white">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#FF5211]"/> ROI %
          </p>
          <h3 className="text-2xl font-bold text-[#FF5211]">
            {safe(formatPct(roiPercent))}
          </h3>
        </div>
      </div> */}

      {/* ===================== 2 COLUMN GRID ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: INPUTS */}
        <div className="space-y-6">
          <div className="p-6 border border-gray-400 rounded-2xl bg-white space-y-8 h-fit">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Target className="w-5 h-5 text-[#FF5211]"/> Business Inputs
            </h2>

            <div className="space-y-5">
              <NumberInput
                label="Monthly Inbound Calls"
                value={monthlyCalls}
                onChange={handle(setMonthlyCalls)}
                icon={Phone}
              />

              <NumberInput
                label="Average Profit Per Sale"
                value={avgProfitPerSale}
                suffix="₹"
                onChange={handle(setAvgProfitPerSale)}
                icon={DollarSign}
              />

              <NumberInput
                label="Conversion Rate"
                value={conversionRate}
                suffix="%"
                onChange={handle(setConversionRate)}
                icon={TrendingUp}
              />

              <div className="grid grid-cols-2 gap-4">
                <NumberInput
                  label="Current Missed Rate"
                  value={missedRateNow}
                  suffix="%"
                  onChange={handle(setMissedRateNow)}
                  icon={Phone}
                />

                <NumberInput
                  label="With FasterQR"
                  value={missedRateWithFasterQ}
                  suffix="%"
                  onChange={handle(setMissedRateWithFasterQ)}
                  icon={Zap}
                />
              </div>

              <NumberInput
                label="FasterQ Monthly Cost"
                value={fasterQMonthlyCost}
                suffix="₹"
                onChange={handle(setFasterQMonthlyCost)}
                icon={DollarSign}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: BREAKDOWN */}
        <div className="flex flex-col gap-3">
          <div className="p-6 border border-gray-300 rounded-2xl bg-white h-fit">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
              <BarChart3 className="w-5 h-5 text-[#FF5211]"/> Monthly Breakdown
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Missed Calls Now</span>
                <span className="font-semibold text-red-600">
                  {safe(missedBefore.toFixed(0))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">With FasterQ</span>
                <span className="font-semibold text-green-600">
                  {safe(missedAfter.toFixed(0))}
                </span>
              </div>

              <hr className="my-3 border border-gray-300" />

              <div className="flex justify-between">
                <span className="text-gray-600">Recovered Calls</span>
                <span className="font-semibold text-[#FF5211]">
                  {safe(recoveredCalls.toFixed(0))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">New Sales</span>
                <span className="font-semibold text-blue-600">
                  {safe(recoveredSales.toFixed(1))}
                </span>
              </div>
            </div>
          </div>

          {/* ROI CARD */}
          <div className="p-6 border rounded-2xl bg-gradient-to-b from-orange-50 to-white border-orange-200">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#FF5211]" /> Annual Impact
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Revenue Recovery</span>
                <span className="font-bold">
                  {safe(formatMoney(recoveredProfitYear))}
                </span>
              </div>

              <div className="flex justify-between">
                <span>FasterQ Cost</span>
                <span className="font-bold">
                  {safe(formatMoney(fasterQCostYear))}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Net Profit</span>
                <span className="font-bold">
                  {safe(formatMoney(netProfitYear))}
                </span>
              </div>

              <div className="text-center mt-3">
                <p className="text-xs text-gray-500 mb-1">ROI</p>
                <p className="text-4xl font-extrabold text-[#FF5211]">
                  {safe(formatPct(roiPercent))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== GRAPHS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* BAR CHART */}
        <div className="p-6 border border-gray-300 rounded-2xl bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Missed Calls Comparison
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF5211" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="p-6 border border-gray-300 rounded-2xl bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Annual Revenue Impact
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="#eee"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#FF5211"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
