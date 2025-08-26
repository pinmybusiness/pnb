  export const getStipendText = (stipend) => {
    if (!stipend || !stipend.amount) return "Unpaid";

    const paymentTypeMap = {
      daily: "/day",
      weekly: "/week",
      monthly: "/month",
      after_completion: " (completion)",
    };

    const period = paymentTypeMap[stipend.paymentType] || "/month";
    const currencySymbol = stipend.currency?.toLowerCase() === "inr" ? "₹" : stipend.currency || "₹";

    return `${currencySymbol}${stipend.totalAmount?.toLocaleString()}${period}`;
  };

  export const getInternshipTypeText = (type) => {
      const typeMap = {
        daily: "Daily Basis",
        weekly: "Weekly",
        weekend: "Weekends Only",
        full_time: "Full Time",
        part_time: "Part Time"
      };
      return typeMap[type] || type.replace(/_/g, " ");
    };

     export const getDayName = (day) => {
        const dayMap = {
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          friday: "Friday",
          saturday: "Saturday",
          sunday: "Sunday"
        };
        return dayMap[day] || day;
      };

    export const getShiftText = (shift) => {
    const shiftMap = {
      morning: "Morning Shift",
      evening: "Evening Shift",
      night: "Night Shift",
      flexible: "Flexible Hours"
    };
    return shiftMap[shift] || shift;
  };

   export const getDurationText = (opportunity) => {
    if (!opportunity.duration || !opportunity.durationUnit) return '';
    return `${opportunity.duration} ${opportunity.durationUnit}`;
  };

   export const getCategoryText = (category) => {
    return category.replace(/([A-Z])/g, ' $1').trim();
  };