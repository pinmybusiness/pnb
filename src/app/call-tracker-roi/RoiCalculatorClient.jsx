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
        value={value === undefined || value === null ? "" : value}
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
  // USER INPUT STATES
  const [monthlyCalls, setMonthlyCalls] = useState();
  const [avgProfitPerSale, setAvgProfitPerSale] = useState();
  const [conversionRate, setConversionRate] = useState();
  const [missedRateNow, setMissedRateNow] = useState(40);
  const [missedRateWithFasterQ, setMissedRateWithFasterQ] = useState(5);
  const [fasterQMonthlyCost, setFasterQMonthlyCost] = useState(99);

  // Check if user filled required inputs
  const isReady =
    monthlyCalls !== undefined &&
    avgProfitPerSale !== undefined &&
    conversionRate !== undefined;

  const num = (v) =>
    typeof v === "number" && !Number.isNaN(v) ? v : 0;

  // SAFE NUMBERS
  const mc = isReady ? num(monthlyCalls) : 0;
  const aps = isReady ? num(avgProfitPerSale) : 0;
  const cr = isReady ? num(conversionRate) : 0;
  const mrNow = num(missedRateNow);
  const mrFq = num(missedRateWithFasterQ);
  const fqMonthly = num(fasterQMonthlyCost);

  // CALCULATIONS
  const missedBefore = isReady ? (mc * mrNow) / 100 : 0;
  const missedAfter = isReady ? (mc * mrFq) / 100 : 0;
  const recoveredCalls = isReady ? Math.max(missedBefore - missedAfter, 0) : 0;

  const recoveredSales = isReady ? (recoveredCalls * cr) / 100 : 0;
  const recoveredProfitMonth = isReady ? recoveredSales * aps : 0;
  const recoveredProfitYear = isReady ? recoveredProfitMonth * 12 : 0;

  // YEARLY PRICING LOGIC
  let fasterQCostYear = isReady ? fqMonthly * 12 : 0;
  if (isReady && fqMonthly === 99) fasterQCostYear = 999;

  const netProfitYear = isReady ? recoveredProfitYear - fasterQCostYear : 0;

  const roiPercent =
    isReady && fasterQCostYear > 0
      ? (netProfitYear / fasterQCostYear) * 100
      : 0;

  const barData = [
    { label: "Missed Calls Now", value: isReady ? missedBefore : 0 },
    { label: "With FasterQ", value: isReady ? missedAfter : 0 },
  ];

  const lineData = [
    { month: "Now", profit: 0 },
    { month: "With FasterQ", profit: isReady ? recoveredProfitYear : 0 },
  ];

  const formatMoney = (n) =>
    `₹${num(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const formatPct = (n) =>
    `${num(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}%`;

  const handle = (setter) => (e) => {
    const val = e.target.value;
    if (val === "") {
      setter(undefined);
      return;
    }
    const parsed = parseFloat(val);
    setter(Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">

      {/* ===================== GRID ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT INPUTS */}
        <div className="space-y-6">
          <div className="p-6 border border-gray-400 rounded-2xl bg-white space-y-8 h-fit">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Target className="w-5 h-5 text-[#FF5211]" /> Business Inputs
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

              <div className="grid grid-cols-2 gap-4" id="roi-results-section">
                <NumberInput
                  label="Current Missed Rate"
                  value={missedRateNow}
                  suffix="%"
                  onChange={handle(setMissedRateNow)}
                  icon={Phone}
                />
                <NumberInput
                  label="With FasterQ"
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

          {/* MOBILE CALCULATE BUTTON */}
          <div className="lg:hidden sticky bottom-4 w-full flex justify-center z-50">
            <button
              onClick={() =>
                document
                  .getElementById("roi-results-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 bg-[#FF5211] text-white font-bold rounded-full shadow-lg shadow-orange-500/30 hover:scale-105 transition-all"
            >
              Calculate ROI
            </button>
          </div>
        </div>

        {/* RIGHT RESULTS */}
        <div className="flex flex-col gap-3 ">
          
          {/* Monthly Breakdown */}
          <div className="p-6 border border-gray-300 rounded-2xl bg-white h-fit">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
              <BarChart3 className="w-5 h-5 text-[#FF5211]" /> Monthly Breakdown
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Missed Calls Now</span>
                <span className="font-semibold text-red-600">
                  {isReady ? missedBefore.toFixed(0) : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">With FasterQ</span>
                <span className="font-semibold text-green-600">
                  {isReady ? missedAfter.toFixed(0) : "-"}
                </span>
              </div>

              <hr className="my-3 border border-gray-300" />

              <div className="flex justify-between">
                <span className="text-gray-600">Recovered Calls</span>
                <span className="font-semibold text-[#FF5211]">
                  {isReady ? recoveredCalls.toFixed(0) : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">New Sales</span>
                <span className="font-semibold text-blue-600">
                  {isReady ? recoveredSales.toFixed(1) : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Annual Impact */}
          <div
            className="p-6 border rounded-2xl bg-gradient-to-b from-orange-50 to-white border-orange-200"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#FF5211]" /> Annual Impact
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Revenue Recovery</span>
                <span className="font-bold">
                  {isReady ? formatMoney(recoveredProfitYear) : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>FasterQ Cost (Yearly)</span>
                <span className="font-bold">
                  {isReady ? formatMoney(fasterQCostYear) : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Net Profit</span>
                <span className="font-bold">
                  {isReady ? formatMoney(netProfitYear) : "-"}
                </span>
              </div>

              <div className="text-center mt-3">
                <p className="text-xs text-gray-500 mb-1">ROI</p>
                <p className="text-4xl font-extrabold text-[#FF5211]">
                  {isReady ? formatPct(roiPercent) : "-"}
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
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
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
