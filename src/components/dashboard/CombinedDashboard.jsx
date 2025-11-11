// components/dashboard/CombinedDashboard.jsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Phone,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Trophy,
  Medal,
  Star,
  Crown,
  BarChart3,
  UserCheck,
  AlertCircle,
  ArrowLeft,
  Ban,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import Link from "next/link";

// ---------- helpers ----------
const getRankIcon = (index) => {
  switch (index) {
    case 0:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 1:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 2:
      return <Star className="h-4 w-4 text-amber-600" />;
    default:
      return <span className="text-xs font-medium text-gray-500">{index + 1}</span>;
  }
};

const formatHour12 = (h) => {
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${suffix}`;
};

// put near the top (helpers)
const WEEK_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const TODAY_LABELS = Array.from({length: 24}, (_,h)=> `${h}:00`);
const monthDayLabels = (d = new Date()) => {
  const y = d.getFullYear(), m = d.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  return Array.from({length: days}, (_,i)=> `Day ${i+1}`);
};

// Option B (you added "outgoing" line): keep total = all calls
// and derive outgoing = total - (answered + missed)
// Call Trends: robust to labels for today/week/month
const formatTrendsData = (trends = [], period = "today") => {
  if (!Array.isArray(trends)) return [];

  const byKey = new Map();

  for (const item of trends) {
    let key;
    let name;

    if (period === "today") {
      const hour = Number(item._id);
      if (isNaN(hour) || hour < 0 || hour > 23) continue;
      key = hour;
      name = formatHour12(hour);
    } else if (period === "week") {
      const idx = Number(item._id);
      if (isNaN(idx) || idx < 0 || idx > 6) continue;
      name = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx];
      key = name;
    } else if (period === "month") {
      const day = Number(item._id);
      if (isNaN(day) || day < 1 || day > 31) continue;
      name = `Day ${day}`;
      key = day;
    } else {
      continue;
    }

    const total = Number(item.callCount || 0);
    const answered = Number(item.answeredCount || 0);
    const missed = Number(item.missedCount || 0);
    const outgoing = Math.max(total - answered - missed, 0);

    byKey.set(key, { name, total, answered, missed, outgoing });
  }


  // Return ordered + zero-filled
  if (period === "today") {
    return Array.from({ length: 24 }, (_, h) => {
      const row = byKey.get(h) || { name: formatHour12(h), total: 0, answered: 0, missed: 0, outgoing: 0 };
      return { name: row.name, total: row.total, answered: row.answered, missed: row.missed, outgoing: row.outgoing };
    });
  }

  if (period === "week") {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return labels.map(label => {
      const row = byKey.get(label) || { name: label, total: 0, answered: 0, missed: 0, outgoing: 0 };
      return { name: label, total: row.total, answered: row.answered, missed: row.missed, outgoing: row.outgoing };
    });
  }

  // Month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const row = byKey.get(day) || { name: `Day ${day}`, total: 0, answered: 0, missed: 0, outgoing: 0 };
    return { name: `Day ${day}`, total: row.total, answered: row.answered, missed: row.missed, outgoing: row.outgoing };
  });
};

// Hourly Distribution -> 12-hour clock labels (AM/PM)
const formatHourlyData = (distribution) => {
  if (!Array.isArray(distribution)) return [];

  // Expect items like: { hour: "13:00" } or { hour: 13 }
  return distribution.map((item) => {
    const raw = item?.hour;
    const hour = typeof raw === "number"
      ? raw
      : Number(String(raw ?? "0:00").split(":")[0].trim());
    const calls = Number(item?.calls || 0);

    return {
      hourLabel: formatHour12(Number.isFinite(hour) ? hour : 0),
      calls
    };
  });
};

// Format to IST: "17 Jul 2025 02:45 PM"
const formatDateIST = (dateString) => {
  try {
    const d = new Date(dateString);
    const day = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit"
    }).format(d);
    const mon = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short"
    }).format(d);
    const year = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric"
    }).format(d);
    const time = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(d);
    return `${day} ${mon} ${year} ${time}`;
  } catch {
    return "-";
  }
};

// ---------- component ----------
const CombinedDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("today");
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dashboard stats (matches backend: IST window + answered=incoming)
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ["dashboard-stats", period],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/stats?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return data.data;
    },
    retry: 2
  });

  // Team performance (answered=incoming only per backend)
const {
  data: teamData,
  isLoading: teamLoading,
  error: teamError
} = useQuery({
  queryKey: ["team-performance", period],
  queryFn: async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/performance?period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return data.data;
  },
  // ensure refetch when period changes and avoid stale cache
  staleTime: 0,                 // always stale
  gcTime: 0,                    // don't keep cache
  refetchOnMount: "always",     // v5: always refetch on mount
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 1
});


  // Detailed team stats + pending missed (backend returns both)
const { data: teamMemberStats, isLoading: memberStatsLoading } = useQuery({
  queryKey: ["team-member-stats", period],
  queryFn: async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/member-stats?period=${period}`,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return data.data; // { teamStats, pendingMissedCalls, totalPendingMissed }
  },
  staleTime: 0,
  gcTime: 0,                 // (v4 ho to cacheTime: 0)
  refetchOnMount: "always",
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 1
});

  // Pending missed calls list (parity with backend getMissedCalls)
  const { data: missedCallsData, isLoading: missedCallsLoading } = useQuery({
    queryKey: ["missed-calls", period], // refetch when period changes (UI stays reactive)
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/missed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return data.data;
    },
    retry: 2
  });

  // Build a quick pending-followups map by receiver id
  const memberPendingFollowups = useMemo(() => {
    if (!Array.isArray(missedCallsData)) return {};
    const map = {};
    for (const call of missedCallsData) {
      const id = call?.receiver?._id;
      if (id) map[id] = (map[id] || 0) + 1;
    }
    return map;
  }, [missedCallsData]);

  const getMemberPendingFollowups = (userId) => memberPendingFollowups[userId] || 0;

  const handleTeamMemberClick = (member) => {
    setSelectedTeamMember(member);
    setActiveTab("overview");
  };

  const handleBackToTeam = () => setSelectedTeamMember(null);

  if (statsError || teamError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 p-4">
        <p className="text-red-500 text-lg text-center">Error loading dashboard data</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {selectedTeamMember && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToTeam}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Team</span>
            </Button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedTeamMember
                ? `${selectedTeamMember.userName}'s Performance`
                : "Call Center Dashboard"}
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              {selectedTeamMember
                ? "Individual performance analytics and insights"
                : activeTab === "overview"
                ? "Complete call analytics and insights"
                : "Team performance and rankings"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <Button
              variant="outline"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between"
            >
              <span>Menu</span>
              {isMobileMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Tab Switcher */}
          {!selectedTeamMember && (
            <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex gap-1 bg-gray-100 p-1 rounded-lg flex-col sm:flex-row`}>
              {[
                { key: "overview", label: "Overview", icon: BarChart3 },
                { key: "team", label: "Team Performance", icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={activeTab === key ? "primary" : "outline"}
                  onClick={() => {
                    setActiveTab(key);
                    setIsMobileMenuOpen(false);
                  }}
                  size="sm"
                  className="text-xs justify-center sm:justify-start"
                  disabled={statsLoading || teamLoading}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          )}

          {/* Period Selector */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex gap-1 bg-gray-100 p-1 rounded-lg flex-col sm:flex-row`}>
            {[
              { key: "today", label: "Today" },
              { key: "week", label: "This Week" },
              { key: "month", label: "This Month" }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={period === key ? "primary" : "outline"}
                onClick={() => {
                  setPeriod(key);
                  setIsMobileMenuOpen(false);
                }}
                size="sm"
                className="text-xs justify-center sm:justify-start"
                disabled={statsLoading || teamLoading}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* INDIVIDUAL TEAM MEMBER VIEW */}
      {selectedTeamMember && (
        <IndividualMemberView
          key={`${selectedTeamMember.userId}-${period}`}   // <- remount on period
          member={selectedTeamMember}
          stats={teamMemberStats?.teamStats?.find(
            (m) => m.userId === selectedTeamMember.userId
          )}
          loading={memberStatsLoading}
          period={period}                                  // <- already passing, keep it
          pendingFollowups={getMemberPendingFollowups(selectedTeamMember.userId)}
        />
      )}

      {/* OVERVIEW TAB */}
      {!selectedTeamMember && activeTab === "overview" && (
        <OverviewTab
          stats={stats}
          statsLoading={statsLoading}
          teamData={teamData}
          teamLoading={teamLoading}
          teamMemberStats={teamMemberStats}
          memberStatsLoading={memberStatsLoading}
          missedCallsData={missedCallsData}
          missedCallsLoading={missedCallsLoading}
          period={period}
          onTeamMemberClick={handleTeamMemberClick}
          getMemberPendingFollowups={getMemberPendingFollowups}
          setActiveTab={setActiveTab}
        />
      )}

      {/* TEAM TAB */}
      {!selectedTeamMember && activeTab === "team" && (
        <TeamPerformanceTab
          teamData={teamData}
          teamLoading={teamLoading}
          onTeamMemberClick={handleTeamMemberClick}
          getMemberPendingFollowups={getMemberPendingFollowups}
        />
      )}
    </div>
  );
};

// ---------- Individual Member ----------
const IndividualMemberView = ({ member, stats, loading, pendingFollowups, period }) => {
  // prefer fresh stats row from query; fallback to clicked snapshot
  const data = stats ?? member;

  // unique fields
  const totalCalls = Number(data?.totalCalls || 0);                // all calls (incoming + outgoing)
  const answered = Number(data?.answeredCalls || 0);
  const missed = Number(data?.missedCalls || 0);
  const answerRate = Number(data?.answerRate || 0);
  const outgoing = Number(data?.outgoingCalls || 0);
  const incomingTotal = answered + missed;                         // incoming-only total

  return (
    <>
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
              {(data?.userName || member?.userName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{data?.userName || member?.userName || "User"}</h2>
            </div>
          </div>

          {/* Top tiles - responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 text-center">
            <Metric label="Total Calls" value={totalCalls} />
            <Metric label="Answered" value={answered} color="text-green-600" />
            <Metric label="Missed" value={missed} color="text-red-600" />
            <Metric label="Answer Rate" value={`${answerRate}%`} color="text-blue-600" />
            <Metric label="Pending" value={Number(pendingFollowups || 0)} color="text-orange-600" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          {loading ? (
            <SkeletonList count={4} />
          ) : (
            <div className="space-y-4">
              <Row
                label="Average Call Duration"
                value={
                  (data?.averageDuration) ??
                  (member?.averageDuration) ??
                  "0:00"
                }
              />
              <Row label="Outgoing Calls" value={outgoing} />
              <Row
                label="Last Activity"
                value={
                  data?.lastActivity
                    ? formatDateIST(data.lastActivity)
                    : member?.lastActivity
                    ? formatDateIST(member.lastActivity)
                    : "No activity"
                }
              />
            </div>
          )}
        </Card>

        {/* Activity Summary (ONLY unique stats now) */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
          {loading ? (
            <SkeletonList count={3} />
          ) : (
            <div className="space-y-3">
              <BadgeRow
                icon={<Phone className="h-4 w-4 text-indigo-600" />}
                label="Incoming Total"
                value={incomingTotal}
                valueClass="text-indigo-600"
              />
              <BadgeRow
                icon={<PhoneOutgoing className="h-4 w-4 text-orange-600" />}
                label="Outgoing Calls"
                value={outgoing}
                valueClass="text-orange-600"
              />
              <BadgeRow
                icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
                label="Answer Rate"
                value={`${answerRate}%`}
                valueClass="text-blue-600"
              />
              <BadgeRow
                icon={<AlertCircle className="h-4 w-4 text-yellow-600" />}
                label="Pending Follow-ups"
                value={Number(pendingFollowups || 0)}
                valueClass="text-yellow-600"
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

// ---------- Overview Tab ----------
const OverviewTab = ({
  stats,
  statsLoading,
  teamData,
  teamLoading,
  teamMemberStats,
  memberStatsLoading,
  missedCallsData,
  missedCallsLoading,
  onTeamMemberClick,
  getMemberPendingFollowups,
  setActiveTab,
  period
}) => {
  const teamSummary =
    Array.isArray(teamData) && teamData.length > 0
      ? {
          totalMembers: teamData.length,
          totalCalls: teamData.reduce((sum, m) => sum + (m.totalCalls || 0), 0),
          topPerformer: teamData[0]?.userName || "N/A",
          avgAnswerRate:
            Math.round(
              teamData.reduce((sum, m) => sum + (m.answerRate || 0), 0) / teamData.length
            ) || 0
        }
      : null;

  return (
    <>
     {/* KPIs - Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link href="/dashboard/tracking" className="lg:col-span-1">
          <KPICard
            title="Total Calls"
            value={stats?.overview?.totalCalls || 0}
            icon={Phone}
            loading={statsLoading}
          />
        </Link>

        <KPICard
          title="Answered"
          value={stats?.overview?.answeredCalls || 0}
          icon={PhoneIncoming}
          loading={statsLoading}
        />

        <KPICard
          title="Unanswered"
          value={stats?.overview?.missedCalls || 0}
          icon={PhoneMissed}
          loading={statsLoading}
        />

        <Link href="/dashboard/trackly/spam-numbers" className="lg:col-span-1">
          <KPICard
            title="Spam Calls"
            value={stats?.overview?.spamCalls || 0}
            icon={Ban}
            loading={statsLoading}
          />
        </Link>

        <Link href="/dashboard/tracking/missed-calls" className="lg:col-span-1">
          <KPICard
            title="Pending Follow-ups"
            value={missedCallsData?.length || 0}
            icon={AlertCircle}
            loading={missedCallsLoading}
          />
        </Link>
      </div>

      {/* Metrics + Team Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-3 sm:gap-4">
          <SimpleKPI icon={<Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />} label="Avg Duration" value={stats?.duration?.average || "0:00"} loading={statsLoading} />
          <SimpleKPI icon={<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />} label="Answer Rate" value={`${stats?.overview?.answerRate || 0}%`} loading={statsLoading} />
          <SimpleKPI icon={<UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />} label="Outgoing Calls" value={stats?.overview?.outgoingCalls || 0} loading={statsLoading} />
          <SimpleKPI icon={<TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2" />} label="Missed Rate" value={`${stats?.overview?.missedRate || 0}%`} loading={statsLoading} />
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Team Summary</h3>
          </div>
          {teamLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : teamSummary ? (
            <div className="space-y-3">
              <KeyVal label="Team Members" value={teamSummary.totalMembers} />
              <KeyVal label="Total Calls" value={teamSummary.totalCalls} />
              <KeyVal label="Avg Answer Rate" value={<span className="text-green-600">{teamSummary.avgAnswerRate}%</span>} />
              <KeyVal label="Top Performer" value={<span className="text-orange-600">{teamSummary.topPerformer}</span>} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No team data available</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => setActiveTab("team")}
            disabled={teamLoading}
          >
            View Full Team Report
          </Button>
        </Card>
      </div>

      {/* Team Member rows */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Member Performance</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveTab("team")} className="flex-1 sm:flex-none">
              View All Team
            </Button>
          </div>
        </div>

        {memberStatsLoading ? (
          <SkeletonList count={5} height="h-12" />
        ) : teamMemberStats?.teamStats?.length ? (
          <div className="space-y-3">
            {teamMemberStats.teamStats.slice(0, 5).map((member, index) => {
              const pending = getMemberPendingFollowups(member.userId);

              return (
                <div
                  key={member.userId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTeamMemberClick(member)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 text-center">{getRankIcon(index)}</div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {member.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{member.userName}</h4>
                    </div>
                  </div>
                  <div className="flex gap-3 sm:gap-6 text-right overflow-x-auto">
                    <KV number value={member.totalCalls} label="Total" />
                    <KV number value={member.answeredCalls} label="Answered" className="text-green-600" />
                    <KV number value={member.missedCalls} label="Missed" className="text-red-600" />
                    <KV value={`${member.answerRate}%`} label="Rate" className="text-blue-600" />
                    <KV number value={pending} label="Pending" className="text-orange-600" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyTeam />
        )}
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Call Trends</h3>
          {statsLoading ? (
            <Skeleton className="h-48 sm:h-64 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
            <LineChart data={formatTrendsData(stats?.trends, period)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="outgoing" stroke="#8884D8" strokeWidth={2} name="Outgoing" connectNulls dot={false} />
              <Line type="monotone" dataKey="total" stroke="#0088FE" strokeWidth={2} name="Total Calls" connectNulls dot={false} />
              <Line type="monotone" dataKey="answered" stroke="#00C49F" strokeWidth={2} name="Answered" connectNulls dot={false} />
              <Line type="monotone" dataKey="missed" stroke="#FF8042" strokeWidth={2} name="Missed" connectNulls dot={false} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
          {statsLoading ? (
            <Skeleton className="h-48 sm:h-64 w-full rounded-lg" />
          ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formatHourlyData(stats?.distribution)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hourLabel" tick={{ fontSize: 10 }} />  {/* <-- changed */}
            <YAxis />
            <Tooltip />
            <Bar dataKey="calls" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

          )}
        </Card>
      </div>
    </>
  );
};

// ---------- Team Tab ----------
const TeamPerformanceTab = ({ teamData, teamLoading, onTeamMemberClick, getMemberPendingFollowups }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
        <KPICard title="Team Members" value={teamData?.length || 0} icon={Users} loading={teamLoading} />
        <KPICard
          title="Total Calls"
          value={teamData?.reduce((sum, m) => sum + (m.totalCalls || 0), 0) || 0}
          icon={Phone}
          loading={teamLoading}
        />
        <KPICard
          title="Avg Answer Rate"
          value={`${
            teamData?.length
              ? Math.round(teamData.reduce((s, m) => s + (m.answerRate || 0), 0) / teamData.length)
              : 0
          }%`}
          icon={TrendingUp}
          loading={teamLoading}
        />
        <KPICard title="Best Performer" value={teamData?.[0]?.userName || "N/A"} icon={Trophy} loading={teamLoading} />
      </div>

      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Leaderboard</h3>
        {teamLoading ? (
          <SkeletonList count={5} height="h-12" />
        ) : teamData?.length ? (
          <div className="space-y-3">
            {teamData.map((member, index) => {
              const pending = getMemberPendingFollowups(member.userId);
              return (
                <div
                  key={member.userId}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTeamMemberClick(member)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 text-center">{getRankIcon(index)}</div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {member.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{member.userName}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{member.userMobile || "No mobile"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 sm:gap-6 text-right overflow-x-auto">
                    <KV number value={member.totalCalls} label="Total" />
                    <KV number value={member.answeredCalls} label="Answered" className="text-green-600" />
                    <KV value={`${Math.round(member.answerRate || 0)}%`} label="Rate" className="text-orange-600" />
                    <KV number value={pending} label="Pending" className="text-yellow-600" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyTeam />
        )}
      </Card>
    </>
  );
};

// ---------- small UI helpers ----------
const Metric = ({ label, value, color }) => (
  <div>
    <div className={`text-lg sm:text-xl md:text-2xl font-bold ${color || "text-gray-900"}`}>{value}</div>
    <div className="text-xs sm:text-sm text-gray-500">{label}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 text-sm sm:text-base">{label}</span>
    <span className="font-semibold text-sm sm:text-base">{value}</span>
  </div>
);

const BadgeRow = ({ icon, label, value, valueClass }) => (
  <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.03)" }}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
    <span className={`font-semibold text-sm sm:text-base ${valueClass || ""}`}>{value}</span>
  </div>
);

const SimpleKPI = ({ icon, label, value, loading }) => (
  <Card className="p-3 sm:p-4 text-center">
    {loading ? <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 rounded-full" /> : icon}
    <h3 className="text-xs sm:text-sm font-medium text-gray-500">{label}</h3>
    {loading ? <Skeleton className="h-4 w-12 sm:h-6 sm:w-16 mx-auto mt-1" /> : <p className="text-lg sm:text-xl font-bold text-gray-900">{value}</p>}
  </Card>
);

const KeyVal = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-semibold text-sm">{value}</span>
  </div>
);

const KV = ({ value, label, className = "", number = false }) => (
  <div className="flex-shrink-0">
    <div className={`font-semibold text-sm sm:text-base ${className}`}>{number ? Number(value || 0) : value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const SkeletonList = ({ count = 4, height = "h-4" }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className={`${height} w-full rounded-lg`} />
    ))}
  </div>
);

const EmptyTeam = () => (
  <div className="text-center py-8 text-gray-500">
    <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-300" />
    <p className="text-sm sm:text-base">No team data available</p>
  </div>
);

export default CombinedDashboard;