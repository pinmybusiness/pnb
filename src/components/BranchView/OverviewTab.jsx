'use client';

import StatusBadge from '@/components/ui/StatusBadge';

const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const OverviewTab = ({ branch }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h2>
        <div className="space-y-6">
          <div>
            <p className="font-medium mb-2 text-sm text-gray-700">Current Status</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={branch.status?.current} />
              {branch.status?.reason && (
                <button
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                  title={branch.status.reason}
                >
                  View reason
                </button>
              )}
            </div>
          </div>
          {branch.trial && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="font-medium text-blue-800 text-sm mb-1">Trial Status</p>
              {branch.trial.isActive ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 font-medium text-sm">Active</span>
                    <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {Math.ceil(
                        (new Date(branch.trial.endDate) - new Date()) / (1000 * 60 * 60 * 24)
                      )}{' '}
                      days left
                    </span>
                  </div>
                  <p className="text-blue-600 text-xs">
                    Started: {new Date(branch.trial.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-blue-600 text-xs">
                    Ends: {new Date(branch.trial.endDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No active trial</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab;