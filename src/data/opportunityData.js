import { Clock, Calendar, Users } from 'lucide-react';

const workCategories = [
  {
    label: 'Culinary & Kitchen Staff',
    options: [
      'All Rounder Chef', 'Ambur Biryani Cook', 'Bakery Chef', 'Barbeque Expert',
      'Breakfast Specialist', 'Butcher (Meat Cutter)', 'Chaat Specialist', 'Chinese Chef',
      'Commi Chef', 'Cook (Indian, Chinese, Continental)', 'Dosa Maker', 'Executive Chef',
      'Fast Food Maker', 'Head Chef', 'Kitchen Helper', 'Kitchen Supervisor',
      'Malvani Konkani Cook', 'Momos Maker', 'Paratha Maker', 'Pastry Chef (Patissier)',
      'Pizza Maker', 'Punjabi Chef', 'Salad Chef', 'Sandwich Maker', 'Shawarma Maker',
      'Sous Chef', 'Thali Specialist', 'Wada Pav / Misal Cook'
    ].map(work => ({ value: work, label: work }))
  },
  {
    label: 'Service & F&B',
    options: [
      'Bar Helper', 'Bar Waiter/Steward', 'Barista', 'Bartender', 'Beverage/Drink Maker',
      'Captain', 'Cocktail Specialist', 'Coffee Maker', 'Counter/Table Service',
      'Food And Beverage Service', 'Host/Hostess', 'Runner', 'Sr. Steward', 'Steward',
      'Table Boy', 'Waiter'
    ].map(work => ({ value: work, label: work }))
  },
  {
    label: 'Management & Supervisory',
    options: [
      'Assistant Restaurant Manager', 'Banquet Manager', 'Cafe Manager', 'Canteen Manager',
      'Conference & Banqueting Manager', 'Floor Manager', 'Head Waiter', 'Kitchen Manager',
      'Outlet Manager', 'Restaurant Manager', 'Restaurant Supervisor', 'Shift Manager',
      'Storage Supervisor', 'Store Incharge'
    ].map(work => ({ value: work, label: work }))
  },
  {
    label: 'General Operations & Support',
    options: [
      'Cleaner', 'Delivery Boy', 'Delivery Rider', 'Dishwasher', 'Driver', 'Maintenance',
      'Safai Kaamgar', 'Security Guard', 'Store Keeper', 'Utility', 'Watchman'
    ].map(work => ({ value: work, label: work }))
  },
  {
    label: 'Administrative & Corporate',
    options: [
      'Account Executive', 'Accountant', 'Front Desk Executive', 'Office Boy',
      'Operational Manager', 'Purchase Incharge', 'Receptionist'
    ].map(work => ({ value: work, label: work }))
  }
];

const languages = [
  'Hindi', 'English', 'Tamil', 'Telugu'
];

const internshipTypes = [
  { 
    value: 'daily', 
    label: 'Daily Basis', 
    // description: 'Help for specific days',
    icon: Clock,
    frequency: 'one_time',
    durationUnit: 'days'
  },
  { 
    value: 'weekly', 
    label: 'Weekly', 
    // description: 'Regular help on specific days each week',
    icon: Calendar,
    frequency: 'regular',
    durationUnit: 'weeks'
  },
  { 
    value: 'weekend', 
    label: 'Weekends Only', 
    // description: 'Regular help on Saturdays and Sundays',
    icon: Calendar,
    frequency: 'regular',
    durationUnit: 'weeks'
  }
];

const jobTypes = [
  { 
    value: 'full_time', 
    label: 'Full Time', 
    // description: 'Regular working hours (8-9 hours)',
    icon: Users,
    frequency: 'regular'
  },
  { 
    value: 'part_time', 
    label: 'Part Time', 
    // description: 'Few hours daily (3-5 hours)',
    icon: Clock,
    frequency: 'regular'
  }
];

const daysOfWeek = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
];

const shifts = [
  { value: 'morning', label: 'Morning (6AM - 2PM)' },
  { value: 'evening', label: 'Evening (2PM - 10PM)' },
  { value: 'night', label: 'Night (10PM - 6AM)' },
  { value: 'flexible', label: 'Flexible Hours' }
];

export { workCategories, languages, internshipTypes, jobTypes, daysOfWeek, shifts };