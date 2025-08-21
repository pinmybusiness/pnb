const KPICard = ({ title, value, change, icon: Icon, trend = "up", className = "" }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)} {change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>

        {/* Right Side (Icon) */}
        {Icon && (
          <div className="p-3 rounded-xl bg-orange-100">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
