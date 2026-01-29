'use client';

import { Trophy, Medal, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui";

const PerformanceSummary = ({ members }) => {
  if (!members || members.length === 0) return null;

  // Calculate performance categories
  const highPerformers = members.filter(m => (m.answerRate || 0) >= 80).length;
  const averagePerformers = members.filter(m => (m.answerRate || 0) >= 60 && (m.answerRate || 0) < 80).length;
  const needsImprovement = members.filter(m => (m.answerRate || 0) < 60).length;

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* High Performers */}
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {highPerformers}
              </div>
              <div className="text-sm font-medium text-green-800">High Performers</div>
              <div className="text-xs text-green-600">80%+ Answer Rate</div>
            </div>
          </div>
        </div>
        
        {/* Average Performers */}
        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <div className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {averagePerformers}
              </div>
              <div className="text-sm font-medium text-yellow-800">Average Performers</div>
              <div className="text-xs text-yellow-600">60-80% Answer Rate</div>
            </div>
          </div>
        </div>
        
        {/* Needs Improvement */}
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {needsImprovement}
              </div>
              <div className="text-sm font-medium text-red-800">Needs Improvement</div>
              <div className="text-xs text-red-600">Below 60% Answer Rate</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceSummary;