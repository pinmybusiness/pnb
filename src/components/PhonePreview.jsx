"use client"
import { useState } from "react";
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
  MessageCircle, Search, Home, Users, BarChart2, User,
  ChevronRight, Bell, Settings, HelpCircle, RefreshCw,
  LogOut, Shield, Zap, TrendingUp, Clock, ArrowUpRight,
  ArrowDownLeft, Plus, Star, ArrowLeft, Battery, Cpu, Clock3, Info
} from "lucide-react";

const ORANGE = "#FF5211";
const BG = "#FFF5EC";

const contacts = [
  { name: "Rahul Sharma", phone: "+91 98765 43210", alt: "+91 99001 23456", avatar: "R", color: "#FF5211" },
  { name: "Neha Verma", phone: "+91 91234 56789", alt: "+91 88123 45678", avatar: "N", color: "#6366f1" },
  { name: "Amit Singh", phone: "+91 90123 45678", alt: "+91 97654 32109", avatar: "A", color: "#0ea5e9" },
  { name: "Priya Gupta", phone: "+91 87654 32109", alt: "+91 91234 56789", avatar: "P", color: "#10b981" },
  { name: "Rohit Yadav", phone: "+91 76543 21098", alt: "+91 80001 23456", avatar: "R", color: "#f59e0b" },
  { name: "Sneha Patel", phone: "+91 95432 10987", alt: "+91 82345 67890", avatar: "S", color: "#ec4899" },
  { name: "Aman Gupta", phone: "+91 85432 30997", alt: "+91 82345 67890", avatar: "S", color: "#167899" },
];

const callLogs = {
  TODAY: [
    { name: "Rahul Sharma", time: "10:32 AM", type: "outgoing", provider: "Airtel", avatar: "R", color: "#FF5211", duration: "4m 12s" },
    { name: "Neha Verma", time: "9:15 AM", type: "incoming", provider: "Jio", avatar: "N", color: "#6366f1", duration: "2m 45s" },
    { name: "Amit Singh", time: "8:50 AM", type: "missed", provider: "BSNL", avatar: "A", color: "#0ea5e9", duration: "" },
  ],
  YESTERDAY: [
    { name: "Priya Gupta", time: "6:30 PM", type: "outgoing", provider: "Vi", avatar: "P", color: "#10b981", duration: "8m 05s" },
    { name: "Rohit Yadav", time: "3:12 PM", type: "incoming", provider: "Airtel", avatar: "R", color: "#f59e0b", duration: "1m 30s" },
  ],
  EARLIER: [
    { name: "Sneha Patel", time: "Mon", type: "outgoing", provider: "Jio", avatar: "S", color: "#ec4899", duration: "5m 20s" },
    { name: "Rahul Sharma", time: "Sun", type: "missed", provider: "Airtel", avatar: "R", color: "#FF5211", duration: "" },
  ],
};

function CallIcon({ type }) {
  if (type === "outgoing") return <ArrowUpRight className="w-3 h-3 text-green-500" />;
  if (type === "incoming") return <ArrowDownLeft className="w-3 h-3 text-blue-500" />;
  return <PhoneMissed className="w-3 h-3 text-red-500" />;
}

function Avatar({ letter, color, size = "w-9 h-9" }) {
  return (
    <div className={`${size} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
      {letter}
    </div>
  );
}

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0"
      style={{
        width: 36,
        height: 20,
        background: enabled ? ORANGE : "#d1d5db",
      }}
    >
      <span
        className="inline-block rounded-full bg-white shadow transition-transform"
        style={{
          width: 14,
          height: 14,
          margin: 3,
          transform: enabled ? "translateX(16px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}

function SettingsScreen({ onBack }) {
  const [simSelection, setSimSelection] = useState("sim1");
  const [callRecording, setCallRecording] = useState(true);

  const simOptions = [
    { id: "both", label: "Both SIMs" },
    { id: "sim1", label: "SIM 1 Only" },
    { id: "sim2", label: "SIM 2 Only" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "#FFF0EB" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: ORANGE }} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-3">

        {/* Section: Active SIM */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 px-1 mb-1 tracking-widest uppercase">Active SIM</p>
          <div className="bg-white rounded-xl shadow-sm p-3">
            <p className="text-xs font-semibold text-gray-800">Select SIM for Tracking</p>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Choose which SIM to track. Calls will be recorded only from the selected SIM.
            </p>
            <div className="mt-2.5 space-y-2">
              {simOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSimSelection(opt.id)}
                  className="w-full flex items-center gap-2.5"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      borderColor: simSelection === opt.id ? ORANGE : "#d1d5db",
                    }}
                  >
                    {simSelection === opt.id && (
                      <div className="w-2 h-2 rounded-full" style={{ background: ORANGE }} />
                    )}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: simSelection === opt.id ? ORANGE : "#374151" }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Call Recording */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 px-1 mb-1 tracking-widest uppercase">Call Recording</p>
          <div className="bg-white rounded-xl shadow-sm p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs font-semibold text-gray-800">Call Recording</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                  Automatically sync call recordings saved on your device.
                </p>
              </div>
              <Toggle enabled={callRecording} onToggle={() => setCallRecording(v => !v)} />
            </div>
          </div>
        </div>

        {/* Section: Real-Time Tracking Controls */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 px-1 mb-1 tracking-widest uppercase">Real-Time Tracking Controls</p>
          <div className="space-y-2">

            {/* Battery Optimization */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0EB" }}>
                  <Battery className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                </div>
                <p className="text-xs font-semibold text-gray-800">Battery Optimization</p>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-2.5">
                Allow background operation to ensure reliable call tracking, even when the device is idle.
              </p>
              <button
                className="w-full py-2 rounded-lg text-[10px] font-bold border-2 transition-all"
                style={{ borderColor: "#ef4444", color: "#ef4444", background: "#fff5f5" }}
              >
                Battery Optimization: Disabled
              </button>
            </div>

            {/* Background Auto Start */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0EB" }}>
                  <Cpu className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                </div>
                <p className="text-xs font-semibold text-gray-800">Background Auto Start</p>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-2.5">
                Allow FasterQ to automatically start in the background for reliable call tracking.
              </p>
              <button
                className="w-full py-2 rounded-lg text-[10px] font-bold transition-all"
                style={{ background: ORANGE, color: "white" }}
              >
                Enable MIUI Auto-Start Settings
              </button>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0EB" }}>
                  <Clock3 className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                </div>
                <p className="text-xs font-semibold text-gray-800">Working Hours</p>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-2.5">
                Working hours apply to real-time tracking only. All calls are tracked 24/7.
              </p>
              <button
                className="w-full py-2 rounded-lg text-[10px] font-bold border-2 transition-all"
                style={{ borderColor: ORANGE, color: ORANGE, background: "#FFF0EB" }}
              >
                Configure Working Hours
              </button>
            </div>
          </div>
        </div>

        {/* Section: About */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 px-1 mb-1 tracking-widest uppercase">About</p>
          <div className="bg-white rounded-xl shadow-sm p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff8c61)` }}>F</div>
              <div>
                <p className="text-xs font-bold text-gray-800">FasterQ</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Helps you track and manage missed calls efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DialerScreen({ onBack }) {
  const [input, setInput] = useState("");

  const keys = ["1","2","3","4","5","6","7","8","9","*","0","⌫"];

  function handleKey(k) {
    if (k === "⌫") setInput(v => v.slice(0, -1));
    else setInput(v => v + k);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "#FFF0EB" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: ORANGE }} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Dialer</h2>
      </div>

      {/* Number display */}
      <div className="px-5 py-3 flex items-center justify-center min-h-[52px]">
        <p className="text-2xl font-bold tracking-widest text-gray-800 text-center">
          {input || <span className="text-gray-300 text-base font-medium">Enter number</span>}
        </p>
      </div>

      {/* Dial pad */}
      <div className="flex-1 px-4 flex flex-col justify-center gap-3">
        <div className="grid grid-cols-3 gap-2.5">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className="flex items-center justify-center rounded-2xl font-bold text-gray-800 transition-all active:scale-95"
              style={{
                background: k === "⌫" ? "#fee2e2" : "#f5d6cc",
                height: 48,
                fontSize: k === "⌫" ? 13 : 16,
                color: k === "⌫" ? "#ef4444" : "#1f2937",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
              }}
            >
              {k === "⌫" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                  <line x1="18" y1="9" x2="12" y2="15"/>
                  <line x1="12" y1="9" x2="18" y2="15"/>
                </svg>
              ) : k}
            </button>
          ))}
        </div>

        {/* Call button */}
        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 mt-1"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            height: 48,
            boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
          }}
        >
          <Phone className="w-4 h-4" />
          Call
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ onOpenDialer }) {
  return (
    <div className="flex flex-col h-full relative">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-2">
        {Object.entries(callLogs).map(([section, calls]) => (
          <div key={section}>
            <p className="text-[10px] font-bold text-gray-400 px-1 mb-1 tracking-widest">{section}</p>
            <div className="space-y-1.5">
              {calls.map((call, i) => (
                <div key={i} className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
                  <Avatar letter={call.avatar} color={call.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <CallIcon type={call.type} />
                      <p className="text-xs font-semibold text-gray-800 truncate">{call.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[10px] text-gray-400">{call.time}</p>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full text-gray-500 font-medium" style={{ background: "#FFF5EC" }}>{call.provider}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#e7fef0" }}>
                      <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                    </button>
                    <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#FFF0EB" }}>
                      <Phone className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Floating Dialer Button */}
      <button
        onClick={onOpenDialer}
        className="absolute bottom-3 right-3 flex items-center justify-center rounded-2xl transition-all active:scale-95"
        style={{
          width: 44,
          height: 44,
          background: "#f5d6cc",
          boxShadow: "0 4px 12px rgba(255,82,17,0.18), 0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        {/* 9-dot dial pad grid icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {[0,1,2].map(row => [0,1,2].map(col => (
            <circle key={`${row}-${col}`} cx={3 + col * 6} cy={3 + row * 6} r="1.5" fill={ORANGE} />
          )))}
        </svg>
      </button>
    </div>
  );
}

function ContactsScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-900">Contacts</h2>
        <div className="mt-2 flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">Search contacts...</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5 pb-2">
        {contacts.map((c, i) => (
          <div key={i} className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
            <div className="relative">
              <Avatar letter={c.avatar} color={c.color} />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow">
                <Plus className="w-2.5 h-2.5 text-gray-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800">{c.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{c.phone}</p>
            </div>
            <div className="flex gap-1.5">
              <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#e7fef0" }}>
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
              </button>
              <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#FFF0EB" }}>
                <Phone className="w-3.5 h-3.5" style={{ color: ORANGE }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsScreen() {
  const [tab, setTab] = useState("Last 7 Days");
  const tabs = ["Today", "Yesterday", "Last 7 Days"];
  const stats = [
    { label: "Outgoing Total", value: "68" },
    { label: "Connected", value: "52" },
    { label: "Incoming Total", value: "56" },
    { label: "Incoming Missed", value: "12" },
    { label: "Total Talk Time", value: "14.2h" },
    { label: "Avg Duration", value: "3m 45s" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-900">Performance</h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Last 7 Days Activity</p>
        <div className="flex gap-1 mt-2 bg-white rounded-xl p-1 shadow-sm">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all"
              style={{ background: tab === t ? ORANGE : "transparent", color: tab === t ? "white" : "#9ca3af" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Total Calls</p>
          <p className="text-5xl font-black mt-1" style={{ color: ORANGE }}>124</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-[10px] text-green-600 font-semibold">+12% vs prev period</span>
          </div>
          <div className="mt-3 bg-orange-50 rounded-xl p-2">
            <p className="text-[10px] text-gray-500">Connection Rate</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: ORANGE }}>56.4%</p>
            <div className="mt-1.5 h-1.5 bg-orange-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "56.4%", background: ORANGE }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
              <p className="text-lg font-bold mt-1" style={{ color: ORANGE }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ onOpenSettings }) {
  const menuItems = [
    { section: "Data Monitoring", items: [{ icon: Shield, label: "Call Delivery Status", onPress: null }] },
    { section: "Account", items: [
      { icon: Settings, label: "Settings", onPress: onOpenSettings },
      { icon: Bell, label: "Notifications", onPress: null },
      { icon: HelpCircle, label: "Help & Support", onPress: null },
    ]},
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-900">Profile</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #ff8c61)` }}>S</div>
          <div>
            <p className="font-bold text-sm text-gray-900">Sanjeev Kumar</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: ORANGE }}>Demo User</span>
          </div>
          <div className="ml-auto">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
        </div>
        {menuItems.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[10px] font-bold text-gray-400 px-1 mb-1 tracking-widest uppercase">{section}</p>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {items.map(({ icon: Icon, label, onPress }, i) => (
                <div
                  key={i}
                  onClick={onPress || undefined}
                  className={`flex items-center gap-3 px-3 py-3 ${i < items.length - 1 ? "border-b border-gray-50" : ""} ${onPress ? "cursor-pointer active:bg-orange-50" : ""}`}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FFF0EB" }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                  </div>
                  <p className="text-xs font-medium text-gray-700 flex-1">{label}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all"
            style={{ borderColor: ORANGE, color: ORANGE }}>
            <RefreshCw className="w-3.5 h-3.5" /> Check for Update
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 text-xs font-semibold">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "contacts", icon: Users, label: "Contacts" },
  { id: "stats", icon: BarChart2, label: "Stats" },
  { id: "profile", icon: User, label: "Profile" },
];

export default function PhonePreview() {
  const [active, setActive] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [showDialer, setShowDialer] = useState(false);

  function renderScreen() {
    if (active === "home" && showDialer) {
      return <DialerScreen onBack={() => setShowDialer(false)} />;
    }
    if (active === "profile" && showSettings) {
      return <SettingsScreen onBack={() => setShowSettings(false)} />;
    }
    switch (active) {
      case "home": return <HomeScreen onOpenDialer={() => setShowDialer(true)} />;
      case "contacts": return <ContactsScreen />;
      case "stats": return <StatsScreen />;
      case "profile": return <ProfileScreen onOpenSettings={() => setShowSettings(true)} />;
      default: return <HomeScreen onOpenDialer={() => setShowDialer(true)} />;
    }
  }

  function handleNavChange(id) {
    setActive(id);
    setShowSettings(false);
    setShowDialer(false);
  }

  return (
    <div className="flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes floatLeft { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatRight { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .float-left { animation: floatLeft 3s ease-in-out infinite; }
        .float-right { animation: floatRight 3s ease-in-out infinite; animation-delay: 1s; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-[3.5rem] blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${ORANGE}, transparent 70%)` }} />

        {/* Phone body */}
        <div className="relative bg-gray-950 rounded-[3.2rem] p-[8px] shadow-2xl"
          style={{ border: "8px solid #1f1f1f", width: 330 }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-950 rounded-b-3xl z-10 flex items-center justify-center gap-2">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-gray-800" />
          </div>

          {/* Screen */}
          <div className="rounded-[2.6rem] overflow-hidden" style={{ background: BG }}>
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-7 pb-1">
              <span className="text-[10px] font-bold text-gray-700">9:41</span>
              <div className="flex items-center gap-1">
                {[3,2.5,2].map((h,i) => (
                  <div key={i} className="w-1 rounded-sm" style={{ height: `${h*4}px`, background: i < 2 ? "#333" : "#ccc" }} />
                ))}
                <div className="w-4 h-2.5 rounded-sm border border-gray-400 ml-1 flex items-center px-0.5">
                  <div className="h-1.5 w-2/3 rounded-xs" style={{ background: ORANGE }} />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div style={{ height: 520 }}>
              {renderScreen()}
            </div>

            {/* Bottom nav */}
            <div className="bg-white border-t border-gray-100 px-2 py-2 flex items-center">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => handleNavChange(id)}
                  className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all"
                  style={{ background: active === id ? "#FFF0EB" : "transparent" }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: active === id ? ORANGE : "#9ca3af", width: 18, height: 18 }} />
                  <span className="text-[9px] font-semibold" style={{ color: active === id ? ORANGE : "#9ca3af" }}>{label}</span>
                </button>
              ))}
            </div>

            {/* Android nav bar */}
            <div className="bg-white flex items-center justify-center gap-6 py-1.5">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-sm" />
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}