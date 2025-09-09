// Remove getCategoryText and add getWorkTypeText
export const getWorkTypeText = (workTypeId, workTypes) => {
  if (!workTypes || workTypes.length === 0) return 'Unknown Work Type';
  
  const workType = workTypes.find(wt => wt.value === workTypeId);
  return workType ? workType.label : 'Unknown Work Type';
};

export const getStipendText = (stipend) => {
  if (!stipend || !stipend.amount) return "Unpaid";

  const paymentTypeMap = {
    0: "/day",
    1: "/week",
    2: "/month",
    3: " (completion)"
  };

  const period = paymentTypeMap[stipend.paymentType] || "/month";
  const currencySymbol = stipend.currency?.toLowerCase() === "inr" ? "₹" : stipend.currency || "₹";

  // Use totalAmount if available, otherwise use amount
  const displayAmount = stipend.totalAmount || stipend.amount;
  return `${currencySymbol}${displayAmount.toLocaleString('en-IN')}${period}`;
};

export const getBenefitsText = (benefitNumbers, benefits) => {
  if (!benefitNumbers || benefitNumbers.length === 0) return "None";
  return benefitNumbers
    .map(number => benefits.find(b => b.backendValue === number)?.label || "Unknown")
    .join(", ");
};

export const getOpportunityTypeText = (type) => {
  const typeMap = {
    0: "Job",
    1: "Internship"
  };
  return typeMap[type] || "Unknown";
};

export const getInternshipTypeText = (type) => {
  const typeMap = {
    0: "Full Time",
    1: "Part Time",
    2: "Daily Basis",
    3: "Weekly",
    4: "Weekends Only"
  };
  return typeMap[type] || "Unknown";
};

export const getPaymentTypeText = (type) => {
  const typeMap = {
    0: "Daily",
    1: "Weekly",
    2: "Monthly",
    3: "After Completion"
  };
  return typeMap[type] || "Unknown";
};

export const getDayName = (day) => {
  const dayMap = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday"
  };
  return dayMap[day] || "Unknown";
};

export const getShiftText = (shift) => {
  const shiftMap = {
    0: "Morning Shift",
    1: "Evening Shift",
    2: "Night Shift",
    3: "Flexible Hours"
  };
  return shiftMap[shift] || "Unknown";
};

export const getDurationText = (opportunity) => {
  if (!opportunity.duration || opportunity.durationUnit === undefined) return '';
  const unitMap = {
    0: "Days",
    1: "Weeks"
  };
  return `${opportunity.duration} ${unitMap[opportunity.durationUnit] || "Days"}`;
};

export const getStatusText = (status) => {
  const statusMap = {
    0: 'Draft',
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
    4: 'Closed',
    5: 'Completed'
  };
  return statusMap[status] || 'Unknown';
};

export const getLanguageText = (languageNumber, languages) => {
  const language = languages.find(lang => lang.backendValue === languageNumber);
  return language ? language.label : "Unknown";
};

// New function to get category text from category slug
export const getCategoryText = (categorySlug, categories) => {
  if (!categories || categories.length === 0) return 'Unknown Category';
  
  const category = categories.find(cat => cat.value === categorySlug);
  return category ? category.label : 'Unknown Category';
};