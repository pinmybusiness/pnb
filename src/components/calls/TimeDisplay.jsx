'use client';

const TimeDisplay = ({ startTime }) => {
  if (!startTime) return null;

  const indianTime = new Date(startTime);

  const timeString = indianTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  const dateString = indianTime.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <div className="text-xs sm:text-sm">
      <div className="font-medium text-gray-900">{timeString}</div>
      <div className="text-xs text-gray-500">{dateString}</div>
    </div>
  );
};

export default TimeDisplay;
