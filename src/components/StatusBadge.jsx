const StatusBadge = ({ status, className = "" }) => {
  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'partnered':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition duration-200 ${getStatusClasses(status)} ${className}`}
    >
      {status || 'No Status'}
    </span>
  );
};

export default StatusBadge;
