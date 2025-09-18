export const getStatusText = (status) => {
  const statusMap = {
    0: 'Applied',
    1: 'Shortlisted',
    2: 'Rejected',
    3: 'Interview',
    4: 'Offer',
    5: 'Hired'
  };
  return statusMap[status] || 'Unknown';
};