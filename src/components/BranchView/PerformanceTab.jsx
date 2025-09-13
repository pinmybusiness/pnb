'use client';

import { BarChart3 } from 'lucide-react';

const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const PerformanceTab = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
      <div className="text-center py-12 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Performance analytics are coming soon.</p>
        <p className="text-sm">This section will include charts and detailed metrics about branch performance.</p>
      </div>
    </Card>
  );
};

export default PerformanceTab;