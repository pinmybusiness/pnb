'use client';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  DollarSign, 
  Users, 
  BookOpen,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Briefcase,
  Utensils,
  Home,
  Calculator
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const CreateOpportunity = () => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [opportunityType, setOpportunityType] = useState('internship');
  const [formData, setFormData] = useState({
    branch: user?.branch,
    category: '',
    opportunityType: 'internship',
    internshipType: 'daily',
    numberOfPeople: 1,
    duration: 1,
    durationUnit: 'days',
    specificDays: [],
    schedule: { 
      days: [], 
      shift: 'flexible', 
      hoursPerDay: 8,
      startDate: '',
      endDate: ''
    },
    stipend: { 
      amount: 0, 
      currency: 'INR', 
      paymentType: 'after_completion',
      includesTips: false,
      includesFood: false,
      includesAccommodation: false
    },
    title: '',
    description: '',
    tags: []
  });

  const categories = [
    'Kitchen Helper', 'Service Staff', 'Management Trainee', 'Marketing Assistant', 
    'Events Coordinator', 'Delivery Helper', 'Other'
  ];

  // Internship types
  const internshipTypes = [
    { 
      value: 'daily', 
      label: 'Daily Basis', 
      description: 'Help for specific days',
      icon: Clock,
      frequency: 'one_time',
      durationUnit: 'days'
    },
    { 
      value: 'weekly', 
      label: 'Weekly', 
      description: 'Regular help on specific days each week',
      icon: Calendar,
      frequency: 'regular',
      durationUnit: 'weeks'
    },
    { 
      value: 'weekend', 
      label: 'Weekends Only', 
      description: 'Regular help on Saturdays and Sundays',
      icon: Calendar,
      frequency: 'regular',
      durationUnit: 'weeks'
    }
  ];

  // Job types (only for job opportunityType)
  const jobTypes = [
    { 
      value: 'full_time', 
      label: 'Full Time', 
      description: 'Regular working hours (8-9 hours)',
      icon: Users,
      frequency: 'regular'
    },
    { 
      value: 'part_time', 
      label: 'Part Time', 
      description: 'Few hours daily (3-5 hours)',
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

  // Get current date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Calculate end date based on start date and duration
  const calculateEndDate = (startDate, duration, durationUnit) => {
    if (!startDate) return '';
    
    const endDate = new Date(startDate);
    
    if (durationUnit === 'days') {
      endDate.setDate(endDate.getDate() + duration);
    } else if (durationUnit === 'weeks') {
      endDate.setDate(endDate.getDate() + (duration * 7));
    }
    
    return endDate.toISOString().split('T')[0];
  };

  // Calculate total stipend amount
  const calculateTotalStipend = () => {
    if (formData.stipend.amount <= 0 || formData.duration <= 0) return 0;
    
    if (formData.durationUnit === 'days') {
      return formData.stipend.amount * formData.duration;
    } else if (formData.durationUnit === 'weeks') {
      // For weekly internships, calculate based on selected days
      let daysPerWeek = formData.specificDays.length;
      if (formData.internshipType === 'weekend') {
        daysPerWeek = 2; // Saturday and Sunday
      }
      return formData.stipend.amount * daysPerWeek * formData.duration;
    }
    
    return 0;
  };

  const calculateTotalAmount = () => {
  if (opportunityType === 'internship') {
    if (formData.stipend.amount <= 0 || formData.duration <= 0) return 0;
    
    if (formData.durationUnit === 'days') {
      return formData.stipend.amount * formData.duration;
    } else if (formData.durationUnit === 'weeks') {
      // For weekly internships, calculate based on selected days
      let daysPerWeek = formData.specificDays.length;
      if (formData.internshipType === 'weekend') {
        daysPerWeek = 2; // Saturday and Sunday
      }
      return formData.stipend.amount * daysPerWeek * formData.duration;
    }
  }
  
  // For jobs, return the amount as-is (monthly)
  return formData.stipend.amount;
};

  // Get current type details
  const getCurrentTypeDetails = () => {
    if (opportunityType === 'internship') {
      return internshipTypes.find(t => t.value === formData.internshipType);
    } else {
      return jobTypes.find(t => t.value === formData.internshipType);
    }
  };

  // Auto-set duration unit based on internship type
  useEffect(() => {
    if (opportunityType === 'internship') {
      const typeDetails = getCurrentTypeDetails();
      if (typeDetails?.durationUnit && typeDetails.durationUnit !== formData.durationUnit) {
        handleInputChange('durationUnit', typeDetails.durationUnit);
        
        // Reset duration to 1 when unit changes
        if (formData.durationUnit !== typeDetails.durationUnit) {
          handleInputChange('duration', 1);
        }
      }
      
      // For internships, set payment type to after_completion
      handleNestedChange('stipend', 'paymentType', 'after_completion');
    }
  }, [formData.internshipType, opportunityType]);

  // Auto-set job-specific values when job type changes
  useEffect(() => {
    if (opportunityType === 'job') {
      // Set payment frequency to monthly for jobs (not editable)
      handleNestedChange('stipend', 'paymentType', 'monthly');
      
      // Set hours per day based on job type
      if (formData.internshipType === 'part_time') {
        handleNestedChange('schedule', 'hoursPerDay', 4);
      } else if (formData.internshipType === 'full_time') {
        handleNestedChange('schedule', 'hoursPerDay', 8);
      }
    }
  }, [opportunityType, formData.internshipType]);

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.schedule.startDate && formData.duration > 0 && opportunityType === 'internship') {
      const endDate = calculateEndDate(
        formData.schedule.startDate, 
        formData.duration, 
        formData.durationUnit
      );
      
      if (endDate !== formData.schedule.endDate) {
        handleNestedChange('schedule', 'endDate', endDate);
      }
    }
  }, [formData.schedule.startDate, formData.duration, formData.durationUnit, opportunityType]);

  // Auto-select weekend days when weekend type is selected
  useEffect(() => {
    if (formData.internshipType === 'weekend') {
      setFormData(prev => ({
        ...prev,
        specificDays: ['saturday', 'sunday']
      }));
    } else if (formData.internshipType === 'weekly') {
      // Keep previously selected days but ensure at least one is selected
      if (formData.specificDays.length === 0) {
        setFormData(prev => ({
          ...prev,
          specificDays: ['monday']
        }));
      }
    }
  }, [formData.internshipType]);

  // Auto-set hours when job type changes to part_time
  useEffect(() => {
    if (opportunityType === 'job' && formData.internshipType === 'part_time') {
      handleNestedChange('schedule', 'hoursPerDay', 4);
    }
  }, [formData.internshipType, opportunityType]);

  // For weekly internships, set start date to next occurrence of selected day
  useEffect(() => {
    if (opportunityType === 'internship' && 
        formData.internshipType === 'weekly' && 
        formData.specificDays.length > 0 &&
        !formData.schedule.startDate) {
      
      const today = new Date();
      const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      // Find the next selected day
      let daysToAdd = 0;
      for (let i = 0; i < 7; i++) {
        const checkDay = (todayDay + i) % 7;
        const dayName = dayNames[checkDay];
        
        if (formData.specificDays.includes(dayName)) {
          daysToAdd = i;
          break;
        }
      }
      
      // Set start date to next selected day
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + daysToAdd);
      
      handleNestedChange('schedule', 'startDate', startDate.toISOString().split('T')[0]);
    }
  }, [formData.specificDays, formData.internshipType, opportunityType]);

  // Auto-generate title based on form data
  useEffect(() => {
    if (formData.category && (formData.internshipType || opportunityType === 'job')) {
      const typeDetails = getCurrentTypeDetails();
      
      // Generate title
      const newTitle = `${formData.category} - ${typeDetails?.label || ''}`;
      setFormData(prev => ({ ...prev, title: newTitle }));
    }
  }, [
    formData.category, 
    formData.internshipType,
    opportunityType
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.internshipType) newErrors.internshipType = 'Type is required';
    
    const typeDetails = getCurrentTypeDetails();
    
    if (typeDetails?.frequency === 'one_time') {
      if (!formData.schedule.startDate) {
        newErrors.startDate = 'Please specify a start date';
      }
    } else {
      // Regular opportunity
      if (formData.internshipType === 'weekly' && formData.specificDays.length === 0) {
        newErrors.specificDays = 'Please select at least one day';
      }
      if (!formData.schedule.startDate) {
        newErrors.startDate = 'Please specify a start date';
      }
      
      // Validate start date is not in the past
      if (formData.schedule.startDate && new Date(formData.schedule.startDate) < new Date()) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }
    
    // Validate duration for internships only
    if (opportunityType === 'internship') {
      if (formData.durationUnit === 'days' && (formData.duration < 1 || formData.duration > 30)) {
        newErrors.duration = 'Duration must be between 1-30 days';
      } else if (formData.durationUnit === 'weeks') {
        // Weekly and weekend internships have max 4 weeks duration
        const maxWeeks = (formData.internshipType === 'weekly' || formData.internshipType === 'weekend') ? 4 : 12;
        if (formData.duration < 1 || formData.duration > maxWeeks) {
          newErrors.duration = `Duration must be between 1-${maxWeeks} weeks`;
        }
      }
    }
    
    // Stipend is mandatory for all opportunities
    if (formData.stipend.amount <= 0) {
      newErrors.stipendAmount = 'Stipend/Salary amount is required';
    }
    
    if (formData.numberOfPeople <= 0) newErrors.numberOfPeople = 'At least 1 person is required';
    if (formData.numberOfPeople > 10) newErrors.numberOfPeople = 'Maximum 10 people allowed';
    
    if (formData.schedule.hoursPerDay <= 0 || formData.schedule.hoursPerDay > 12) {
      newErrors.hoursPerDay = 'Hours per day must be between 1-12';
    }
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!token && !authLoading) {
      toast.error('Please login first');
      router.push('/auth/login');
    }
  }, [token, user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    // Calculate the appropriate amount based on opportunity type
  const finalAmount = calculateTotalAmount();

    // Prepare final data
    const submitData = {
      ...formData,
        stipend: {
      ...formData.stipend,
      amount: finalAmount
    },
      opportunityType,
      isJob: opportunityType === 'job'
    };

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(`${opportunityType === 'job' ? 'Job' : 'Internship'} created successfully!`);
        router.push('/dashboard/opportunities');
      }
    } catch (error) {
      console.error('Create opportunity error:', error);
      toast.error(error.response?.data?.message || `Failed to create ${opportunityType}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (field) => 
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      errors[field] 
        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
        : 'border-gray-300 focus:ring-primary'
    }`;

  const currentTypeDetails = getCurrentTypeDetails();
  const isOneTime = currentTypeDetails?.frequency === 'one_time';
  const isJob = opportunityType === 'job';
  const isWeeklyOrWeekend = formData.internshipType === 'weekly' || formData.internshipType === 'weekend';
  const totalStipend = calculateTotalStipend();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-primary mr-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Opportunity</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="space-y-8">
          
          {/* Section 0: Opportunity Type Selection */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              What type of opportunity are you offering?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOpportunityType('internship')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center text-center transition-all ${
                  opportunityType === 'internship'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <BookOpen className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium mb-1">Internship</span>
                <span className="text-xs text-gray-500">Learning opportunity for students</span>
              </button>

              <button
                type="button"
                onClick={() => setOpportunityType('job')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center text-center transition-all ${
                  opportunityType === 'job'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <Briefcase className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium mb-1">Job</span>
                <span className="text-xs text-gray-500">Employment opportunity</span>
              </button>
            </div>
          </div>
          
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              What type of help do you need?
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What kind of work? *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={inputClassName('category')}
                >
                  <option value="">Select work type</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isJob ? 'Job Type *' : 'Internship Type *'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(isJob ? jobTypes : internshipTypes).map(type => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('internshipType', type.value)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center text-center transition-all ${
                          formData.internshipType === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-25'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mb-2" />
                        <span className="text-sm font-medium mb-1">{type.label}</span>
                        <span className="text-xs text-gray-500">{type.description}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.internshipType && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.internshipType}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Duration (for internships only) */}
          {!isJob && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Duration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How long do you need help? *
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={formData.durationUnit === 'days' ? 30 : isWeeklyOrWeekend ? 4 : 12}
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                      className={`${inputClassName('duration')} w-full sm:w-24`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {formData.durationUnit === 'days' ? 'Days' : 'Weeks'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formData.durationUnit === 'days' 
                        ? 'Max 30 days' 
                        : isWeeklyOrWeekend 
                          ? 'Max 4 weeks' 
                          : 'Max 12 weeks'
                      }
                    </span>
                  </div>
                  {errors.duration && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Timing Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Schedule Details
            </h3>
            
            <div className="space-y-6">
              {(formData.internshipType === 'weekly' || formData.internshipType === 'weekend') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which days? *
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        disabled={formData.internshipType === 'weekend' && !['saturday', 'sunday'].includes(day.value)}
                        className={`p-2 rounded-md text-sm font-medium transition-colors ${
                          formData.specificDays.includes(day.value)
                            ? 'bg-blue-500 text-white border border-blue-500'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        } ${
                          formData.internshipType === 'weekend' && !['saturday', 'sunday'].includes(day.value)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.specificDays && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.specificDays}
                  </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.schedule.startDate}
                    onChange={(e) => handleNestedChange('schedule', 'startDate', e.target.value)}
                    min={getTodayDate()}
                    className={inputClassName('startDate')}
                  />
                  {errors.startDate && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.startDate}
                    </p>
                  )}
                </div>

                {!isJob && formData.schedule.startDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Auto-calculated)
                    </label>
                    <input
                      type="date"
                      value={formData.schedule.endDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculated based on start date and duration
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Per Day *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.schedule.hoursPerDay}
                    onChange={(e) => handleNestedChange('schedule', 'hoursPerDay', parseInt(e.target.value) || 1)}
                    className={inputClassName('hoursPerDay')}
                  />
                  {errors.hoursPerDay && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.hoursPerDay}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift Timing *
                  </label>
                  <select
                    value={formData.schedule.shift}
                    onChange={(e) => handleNestedChange('schedule', 'shift', e.target.value)}
                    className={inputClassName('shift')}
                  >
                    {shifts.map(shift => (
                      <option key={shift.value} value={shift.value}>
                        {shift.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many people needed? *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.numberOfPeople}
                  onChange={(e) => handleInputChange('numberOfPeople', parseInt(e.target.value) || 1)}
                  className={inputClassName('numberOfPeople')}
                />
                {errors.numberOfPeople && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.numberOfPeople}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Payment Details
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isJob ? 'Salary Amount (₹) *' : 'Stipend Amount (₹ per day) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stipend.amount}
                    onChange={(e) => handleNestedChange('stipend', 'amount', parseInt(e.target.value) || 0)}
                    className={inputClassName('stipendAmount')}
                    placeholder="Enter amount"
                  />
                  {errors.stipendAmount && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.stipendAmount}
                    </p>
                  )}
                  {!isJob && formData.stipend.amount > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-center text-blue-700">
                        <Calculator className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          Total Stipend: ₹{calculateTotalAmount()} (paid after completion)
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        {formData.duration} {formData.durationUnit} × ₹{formData.stipend.amount} per day
                        {formData.durationUnit === 'weeks' && formData.specificDays.length > 0 && 
                          ` × ${formData.specificDays.length} days/week`
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Frequency
                  </label>
                  {isJob ? (
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      <span className="text-gray-700">Monthly</span>
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      <span className="text-gray-700">After Completion</span>
                    </div>
                  )}
                  {isJob && (
                    <p className="text-xs text-gray-500 mt-1">
                      Jobs are paid monthly
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stipend.includesTips}
                    onChange={(e) => handleNestedChange('stipend', 'includesTips', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Includes tips
                  </span>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stipend.includesFood}
                    onChange={(e) => handleNestedChange('stipend', 'includesFood', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center">
                    <Utensils className="h-4 w-4 mr-1" />
                    Food provided
                  </span>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stipend.includesAccommodation}
                    onChange={(e) => handleNestedChange('stipend', 'includesAccommodation', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Accommodation provided
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Title and Description */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              {isJob ? 'Job Details' : 'Internship Details'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isJob ? 'Job Title *' : 'Internship Title *'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={inputClassName('title')}
                  placeholder={`Enter ${isJob ? 'job' : 'internship'} title`}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.title}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Title is auto-generated but can be modified
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the opportunity in detail (optional)..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length} characters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-soft">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-custom text-white rounded-md hover:bg-green-custom/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Create {isJob ? 'Job' : 'Internship'}
              </>
            )
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity;