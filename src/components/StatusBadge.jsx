const StatusBadge = ({ status, className = "" }) => {
  const getStatusClasses = (status) => {
    // Handle cases where status is not a string
    const statusString = typeof status === 'string' ? status.toLowerCase() : '';
    
    switch (statusString) {
      case 'partnered':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'in progress':
      case 'in_progress': // Handle different case formats
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'no_status':
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const displayText = typeof status === 'string' 
    ? status.replace('_', ' ') // Replace underscores with spaces for display
    : 'No Status';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition duration-200 ${getStatusClasses(status)} ${className}`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;