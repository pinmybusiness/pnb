"use client";

import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Circle,
  Voicemail,
  Zap,
} from "lucide-react";

// ─── Color Tokens (CSS vars injected via style tag) ───────────────────────────
const CSS_VARS = `
  :root {
    --primary: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --primary-bg: #eef2ff;
    --primary-border: #c7d2fe;
  }
`;

// ─── Tiny sub-components ──────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, delta, positive, color }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        <span
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: color + "22" }}
        >
          <Icon size={12} style={{ color }} />
        </span>
      </div>
      <div className="text-xl font-bold text-gray-800 leading-none">{value}</div>
      <div
        className={`flex items-center gap-1 text-[10px] font-medium ${
          positive ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {delta} vs last week
      </div>
    </div>
  );
}

const CALLS = [
  { name: "Sarah Johnson", time: "2m ago", dur: "4:32", type: "in", status: "answered" },
  { name: "Marcus Lee", time: "18m ago", dur: "—", type: "miss", status: "missed" },
  { name: "Priya Patel", time: "34m ago", dur: "1:07", type: "out", status: "answered" },
  { name: "Tom Eriksen", time: "1h ago", dur: "9:15", type: "out", status: "answered" },
  { name: "Amelia Chow", time: "2h ago", dur: "—", type: "miss", status: "missed" },
];

const TYPE_META = {
  in:   { icon: PhoneIncoming,  color: "#10b981", label: "Incoming"  },
  out:  { icon: PhoneOutgoing,  color: "#6366f1", label: "Outgoing"  },
  miss: { icon: PhoneMissed,    color: "#f43f5e", label: "Missed"    },
};

function CallRow({ name, time, dur, type, status }) {
  const { icon: Icon, color, label } = TYPE_META[type];
  return (
    <tr className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors">
      <td className="py-2 px-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: color }}
          >
            {name[0]}
          </div>
          <span className="text-[11px] font-medium text-gray-700">{name}</span>
        </div>
      </td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-1">
          <Icon size={10} style={{ color }} />
          <span className="text-[10px] text-gray-500">{label}</span>
        </div>
      </td>
      <td className="py-2 px-2">
        <span className="text-[10px] text-gray-400">{dur}</span>
      </td>
      <td className="py-2 px-2">
        <span
          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
            status === "missed"
              ? "bg-rose-50 text-rose-500"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="py-2 px-2 text-[10px] text-gray-400">{time}</td>
    </tr>
  );
}

// ─── Dashboard UI (rendered inside the laptop screen) ────────────────────────
function DashboardUI() {
  return (
    <div className="w-full h-full flex text-[11px] bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-[52px] bg-gray-900 flex flex-col items-center py-3 gap-4 flex-shrink-0">
        {/* Logo mark */}
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center mb-1">
          <Zap size={14} className="text-white" />
        </div>
        {[LayoutDashboard, Phone, Users, BarChart2, Settings].map((Icon, i) => (
          <button
            key={i}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              i === 0
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-9 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <Search size={11} className="text-gray-400" />
            <span className="text-gray-300 text-[10px]">Search calls, contacts…</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell size={13} className="text-gray-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[9px] font-bold text-white">
              AJ
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 flex flex-col gap-3">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-gray-800 text-sm leading-none">Dashboard</h1>
              <p className="text-[9px] text-gray-400 mt-0.5">Monday, March 13</p>
            </div>
            <button className="flex items-center gap-1 bg-indigo-500 text-white text-[9px] font-semibold px-2.5 py-1.5 rounded-lg">
              <Phone size={9} />
              New Call
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2">
            <StatCard icon={Phone}         label="Total Calls"    value="2,841" delta="+12.4%"  positive color="#6366f1" />
            <StatCard icon={PhoneIncoming} label="Incoming"       value="1,204" delta="+8.1%"   positive color="#10b981" />
            <StatCard icon={PhoneOutgoing} label="Outgoing"       value="1,398" delta="+17.3%"  positive color="#3b82f6" />
            <StatCard icon={PhoneMissed}   label="Missed"         value="239"   delta="-3.2%"   positive={false} color="#f43f5e" />
          </div>

          {/* Recent calls table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50">
              <span className="text-[11px] font-semibold text-gray-700">Recent Calls</span>
              <span className="text-[9px] text-indigo-500 font-medium cursor-pointer">View all →</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  {["Contact", "Type", "Duration", "Status", "When"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] font-semibold text-gray-400 uppercase tracking-wide py-1.5 px-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CALLS.map((c, i) => (
                  <CallRow key={i} {...c} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mini chart placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-700">Call Volume</span>
              <div className="flex gap-1">
                {["7D","30D","90D"].map((l,i) => (
                  <span key={l} className={`text-[9px] px-2 py-0.5 rounded-md font-medium cursor-pointer ${i===0 ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-gray-600"}`}>{l}</span>
                ))}
              </div>
            </div>
            {/* Fake bar chart */}
            <div className="flex items-end gap-1 h-12">
              {[65, 80, 55, 90, 75, 100, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 5 ? "#6366f1" : "#e0e7ff",
                      transition: "height 0.3s",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <span key={d} className="flex-1 text-center text-[8px] text-gray-300">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Laptop Mockup ────────────────────────────────────────────────────────────
function LaptopMockup() {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Screen */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Bezel */}
        <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl shadow-gray-900/40">
          {/* Camera dot */}
          <div className="flex justify-center pb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          </div>
          {/* Screen glass */}
          <div
            className="rounded-xl overflow-hidden border border-gray-700"
            style={{ aspectRatio: "16/10", background: "#f8fafc" }}
          >
            <DashboardUI />
          </div>
        </div>
      </div>

      {/* Keyboard plate */}
      <div className="relative -mt-px w-[110%] max-w-3xl flex flex-col items-center">
        {/* Hinge bar */}
        <div className="w-full h-2 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-sm shadow-inner" />
        {/* Base */}
        <div
          className="w-full h-4 rounded-b-2xl shadow-xl"
          style={{
            background: "linear-gradient(to bottom, #d1d5db, #9ca3af)",
          }}
        />
        {/* Table shadow */}
        <div className="w-[90%] h-3 bg-black/10 rounded-full blur-sm mt-0.5" />
      </div>
    </div>
  );
}

// ─── Floating UI Badges ───────────────────────────────────────────────────────
function FloatingCard({ className, children }) {
  return (
    <div
      className={`absolute z-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function DashboardDemoSection() {
  return (
    <>
      <style>{CSS_VARS}</style>
      <section className="relative w-full overflow-hidden bg-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          {/* Top-left blob */}
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
          />
          {/* Bottom-right blob */}
          <div
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* ── Header copy ── */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <Zap size={14} />
            Live product preview
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Everything you need to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              manage every call.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            A unified dashboard that gives your team real-time visibility into call
            analytics, contact history, and performance metrics — all in one place.
          </p>
        </div>

        {/* ── Laptop + floating cards ── */}
        <div className="relative mx-auto max-w-5xl">
          {/* ── Floating: Analytics card (top-left) ── */}
          <FloatingCard className="hidden lg:block left-0 top-10 w-44 animate-[float_4s_ease-in-out_infinite]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={12} className="text-emerald-500" />
              </div>
              <span className="text-[11px] font-semibold text-gray-600">Call Growth</span>
            </div>
            <div className="text-2xl font-black text-gray-800">+24%</div>
            <div className="text-[10px] text-gray-400 mt-0.5">vs. previous month</div>
            <div className="flex items-end gap-0.5 h-8 mt-2">
              {[40,55,45,70,60,85,75].map((h,i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height:`${h}%`, background: i===6?"#10b981":"#d1fae5" }} />
              ))}
            </div>
          </FloatingCard>

          {/* ── Floating: Live notification (top-right) ── */}
          <FloatingCard className="hidden lg:block right-0 top-6 w-52">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                SJ
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-gray-800 truncate">Incoming call</div>
                <div className="text-[10px] text-gray-400">Sarah Johnson · Now</div>
              </div>
              <div className="flex gap-1">
                <button className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Phone size={10} className="text-white" />
                </button>
                <button className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                  <PhoneMissed size={10} className="text-rose-500" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-50">
              <Circle size={8} className="text-emerald-500 fill-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-400">Live · Connecting…</span>
            </div>
          </FloatingCard>

          {/* ── Floating: Stat widget (bottom-left) ── */}
          <FloatingCard className="hidden lg:block left-4 bottom-16 w-40">
            <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Avg Handle Time</div>
            <div className="text-xl font-black text-gray-800">3m 42s</div>
            <div className="flex items-center gap-1 mt-1">
              <ChevronDown size={10} className="text-emerald-500" />
              <span className="text-[10px] text-emerald-500 font-medium">8s faster</span>
              <span className="text-[10px] text-gray-400">this week</span>
            </div>
          </FloatingCard>

          {/* ── Floating: Voicemail badge (bottom-right) ── */}
          <FloatingCard className="hidden lg:block right-4 bottom-20 w-44">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <Voicemail size={13} className="text-violet-500" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gray-700">Voicemails</div>
                <div className="text-[9px] text-gray-400">3 unheard</div>
              </div>
            </div>
            {[
              { name: "Marcus L.", dur: "0:45" },
              { name: "Amelia C.", dur: "1:12" },
            ].map(({ name, dur }) => (
              <div key={name} className="flex items-center justify-between py-1 border-t border-gray-50">
                <span className="text-[10px] text-gray-600">{name}</span>
                <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                  <Clock size={8} />{dur}
                </span>
              </div>
            ))}
          </FloatingCard>

          {/* Laptop */}
          <LaptopMockup />
        </div>

        {/* ── Feature pills ── */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Phone,         label: "Real-time call tracking"     },
            { icon: BarChart2,     label: "Advanced analytics"          },
            { icon: Users,         label: "Team performance"            },
            { icon: Voicemail,     label: "Voicemail management"        },
            { icon: Zap,           label: "Instant notifications"       },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 text-gray-600 hover:text-indigo-600 text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-default"
            >
              <Icon size={14} />
              {label}
            </div>
          ))}
        </div>

        {/* Keyframe for floating animation (injected inline) */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-8px); }
          }
        `}</style>
      </section>
    </>
  );
} 