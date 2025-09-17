import { Clock, Calendar, Users, Utensils, Home, DollarSign, Briefcase } from 'lucide-react';

export const languages = [
  { label: 'English', backendValue: 0 },
  { label: 'Hindi', backendValue: 1 },
  { label: 'Telugu', backendValue: 2 },
  { label: 'Tamil', backendValue: 3 },
];

export const benefits = [
  { value: 'tips', label: 'Includes Tips', backendValue: 0, icon: DollarSign },
  { value: 'food', label: 'Food Provided', backendValue: 1, icon: Utensils },
  { value: 'accommodation', label: 'Accommodation Provided', backendValue: 2, icon: Home }
];

export const opportunityTypes = [
  { 
    value: 'job', 
    label: 'Job', 
    backendValue: 0, 
    icon: Briefcase 
  },
  { 
    value: 'internship', 
    label: 'Internship', 
    backendValue: 1, 
    icon: Calendar 
  }
];

export const internshipTypes = [
  { 
    value: 'daily', 
    label: 'Daily Basis', 
    icon: Clock,
    frequency: 'one_time',
    durationUnit: 'days',
    backendValue: 2 // Maps to Opportunity.internshipType enum: 2 (daily)
  },
  { 
    value: 'weekly', 
    label: 'Weekly', 
    icon: Calendar,
    frequency: 'regular',
    durationUnit: 'weeks',
    backendValue: 3 // Maps to Opportunity.internshipType enum: 3 (weekly)
  },
  { 
    value: 'weekend', 
    label: 'Weekends Only', 
    icon: Calendar,
    frequency: 'regular',
    durationUnit: 'weeks',
    backendValue: 4 // Maps to Opportunity.internshipType enum: 4 (weekend)
  }
];

export const jobTypes = [
  { 
    value: 'full_time', 
    label: 'Full Time', 
    icon: Users,
    frequency: 'regular',
    backendValue: 0 // Maps to Opportunity.internshipType enum: 0 (full_time)
  },
  { 
    value: 'part_time', 
    label: 'Part Time', 
    icon: Clock,
    frequency: 'regular',
    backendValue: 1 // Maps to Opportunity.internshipType enum: 1 (part_time)
  }
];

export const daysOfWeek = [
  { value: 'monday', label: 'Mon', backendValue: 0 },
  { value: 'tuesday', label: 'Tue', backendValue: 1 },
  { value: 'wednesday', label: 'Wed', backendValue: 2 },
  { value: 'thursday', label: 'Thu', backendValue: 3 },
  { value: 'friday', label: 'Fri', backendValue: 4 },
  { value: 'saturday', label: 'Sat', backendValue: 5 },
  { value: 'sunday', label: 'Sun', backendValue: 6 }
];

export const shifts = [
  { value: 'morning', label: 'Morning (6AM - 2PM)', backendValue: 0 },
  { value: 'evening', label: 'Evening (2PM - 10PM)', backendValue: 1 },
  { value: 'night', label: 'Night (10PM - 6AM)', backendValue: 2 },
  { value: 'flexible', label: 'Flexible Hours', backendValue: 3 }
];

export const durationUnits = [
  { value: 'days', label: 'Days', backendValue: 0 },
  { value: 'weeks', label: 'Weeks', backendValue: 1 }
];

export const paymentTypes = [
  { value: 'monthly', label: 'Monthly', backendValue: 0 },
  { value: 'after_completion', label: 'After Completion', backendValue: 1 },
  { value: 'daily', label: 'Daily', backendValue: 2 },
  { value: 'weekly', label: 'Weekly', backendValue: 3 }
];

// Placeholder for workTypes, will be fetched dynamically
export let workTypes = [];

// Function to fetch workTypes from API
export const fetchWorkTypes = async (token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-roles/work-types/all`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Transform the API response to match the expected format
      workTypes = data.data.map(workType => ({
        value: workType._id, // Use MongoDB _id as value
        label: workType.name,
        slug: workType.slug,
        categorySlug: workType.categorySlug
      }));
      
      return workTypes;
    } else {
      console.error('API returned error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching work types:', error);
    return [];
  }
};

// Function to fetch work types by category
export const fetchWorkTypesByCategory = async (categorySlug, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/job-roles/categories/${categorySlug}/work-types`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(workType => ({
        value: workType._id,
        label: workType.name,
        slug: workType.slug
      }));
    } else {
      console.error('API returned error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching work types by category:', error);
    return [];
  }
};

// Function to fetch categories
export const fetchCategories = async (token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-roles/categories`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.map(category => ({
        value: category.slug,
        label: category.name,
        description: category.description
      }));
    } else {
      console.error('API returned error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Remove getCategoryText and add getWorkTypeText
export const getWorkTypeText = (workTypeId, workTypes) => {
  if (!workTypes || workTypes.length === 0) return 'Unknown Work Type';
  
  const workType = workTypes.find(wt => wt.value === workTypeId);
  return workType ? workType.label : 'Unknown Work Type';
};

export const getStipendText = ({ 
  minAmount, 
  maxAmount, 
  stipendAmount, 
  totalAmount, 
  currency, 
  paymentType 
}) => {
  const currencySymbol = currency?.toLowerCase() === "inr" ? "₹" : currency || "₹";

  if (paymentType === 0) {
    // Job: Display salary range
    if (!minAmount && !maxAmount) return "Unpaid";

    if (minAmount && maxAmount && minAmount === maxAmount) {
      // Same salary → show single amount
      return `${currencySymbol}${minAmount.toLocaleString('en-IN')} /month`;
    }

    if (minAmount && maxAmount) {
      return `${currencySymbol}${minAmount.toLocaleString('en-IN')} - ${maxAmount.toLocaleString('en-IN')} /month`;
    }

    // If only one amount is given
    if (minAmount) return `${currencySymbol}${minAmount.toLocaleString('en-IN')} /month`;
    if (maxAmount) return `${currencySymbol}${maxAmount.toLocaleString('en-IN')} /month`;

  } else if (paymentType === 1) {
    // Internship: Display total stipend
    if (!stipendAmount || stipendAmount <= 0) return "Unpaid";
    const displayAmount = totalAmount || stipendAmount;
    return `${currencySymbol}${displayAmount.toLocaleString('en-IN')} (after completion)`;
  }

  return "Unpaid";
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
    0: "Monthly",
    1: "After Completion",
    2: "Daily",
    3: "Weekly"
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