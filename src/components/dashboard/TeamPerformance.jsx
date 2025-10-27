'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Clock,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
  Crown
} from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton  from '@/components/ui/Skeleton';

const TeamPerformance = () => {
  const [period, setPeriod] = useState('today');
  const [metric, setMetric] = useState('calls'); // calls, answered, duration

  const { data: teamData, isLoading, error } = useQuery({
    queryKey: ['team-performance', period, metric],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/performance?period=${period}&type=${metric}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    },
    refetchInterval: 300000,
  });

  const periodButtons = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' }
  ];

  const metricButtons = [
    { key: 'calls', label: 'Total Calls', icon: Phone },
    { key: 'answered', label: 'Answered', icon: PhoneIncoming },
    { key: 'duration', label: 'Talk Time', icon: Clock }
  ];

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Star className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-gray-500">{index + 1}</span>;
    }
  };

  const getPerformanceColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500 text-lg">Error loading team performance</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-sm sm:text-base text-gray-500">Compare team members performance and metrics</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {periodButtons.map(({ key, label }) => (
            <Button
              key={key}
              variant={period === key ? 'primary' : 'outline'}
              onClick={() => setPeriod(key)}
              size="sm"
              disabled={isLoading}
            >
              {label}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {metricButtons.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={metric === key ? 'gradient' : 'outline'}
              onClick={() => setMetric(key)}
              size="sm"
              disabled={isLoading}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Top Performers Summary */}
      {!isLoading && teamData && teamData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teamData.slice(0, 3).map((member, index) => (
            <Card key={member.userId} className="p-4 relative overflow-hidden">
              {index === 0 && (
                <div className="absolute top-2 right-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                  {getRankIcon(index)}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {member.userName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {metric === 'calls' && `${member.totalCalls} total calls`}
                    {metric === 'answered' && `${member.answeredCalls} answered`}
                    {metric === 'duration' && `${member.averageDuration} avg`}
                  </p>
                </div>
              </div>

              {metric === 'calls' && member.performanceScore && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Performance</span>
                    <span className={`font-semibold ${getPerformanceColor(member.performanceScore, 100)}`}>
                      {Math.round(member.performanceScore)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(member.performanceScore, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Team Table */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Leaderboard</h3>
          <p className="text-sm text-gray-500">
            {metric === 'calls' && 'Total calls handled by each team member'}
            {metric === 'answered' && 'Answered calls and average duration'}
            {metric === 'duration' && 'Total talk time and average call duration'}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : teamData && teamData.length > 0 ? (
          <div className="space-y-4">
            {teamData.map((member, index) => (
              <div 
                key={member.userId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {member.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {member.userName}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {member.userEmail}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center space-x-6 text-right">
                    {metric === 'calls' && (
                      <>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{member.totalCalls}</p>
                          <p className="text-xs text-gray-500">Total Calls</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-600">{member.answeredCalls}</p>
                          <p className="text-xs text-gray-500">Answered</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-red-600">{member.missedCalls}</p>
                          <p className="text-xs text-gray-500">Missed</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-600">{member.outgoingCalls}</p>
                          <p className="text-xs text-gray-500">Outgoing</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-600">
                            {Math.round(member.answerRate || 0)}%
                          </p>
                          <p className="text-xs text-gray-500">Answer Rate</p>
                        </div>
                      </>
                    )}

                    {metric === 'answered' && (
                      <>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{member.answeredCalls}</p>
                          <p className="text-xs text-gray-500">Answered</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-600">{member.averageDuration}</p>
                          <p className="text-xs text-gray-500">Avg Duration</p>
                        </div>
                      </>
                    )}

                    {metric === 'duration' && (
                      <>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{member.totalCalls}</p>
                          <p className="text-xs text-gray-500">Calls</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-600">{member.averageDuration}</p>
                          <p className="text-xs text-gray-500">Avg Duration</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-600">
                            {member.totalDurationFormatted}
                          </p>
                          <p className="text-xs text-gray-500">Total Time</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Users className="h-8 w-8 mb-2" />
            <p>No team data available for this period</p>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      {!isLoading && teamData && teamData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            title="Team Members"
            value={teamData.length}
            icon={Users}
          />
          <KPICard
            title="Total Team Calls"
            value={teamData.reduce((sum, member) => sum + (member.totalCalls || 0), 0)}
            icon={Phone}
          />
          <KPICard
            title="Team Answer Rate"
            value={`${Math.round(
              teamData.reduce((sum, member) => sum + (member.answerRate || 0), 0) / teamData.length
            )}%`}
            icon={TrendingUp}
          />
          <KPICard
            title="Best Performer"
            value={teamData[0]?.userName?.split(' ')[0] || 'N/A'}
            icon={Trophy}
          />
        </div>
      )}
    </div>
  );
};

export default TeamPerformance;