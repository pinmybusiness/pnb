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
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const CreateInternship = () => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [opportunityType, setOpportunityType] = useState('internship');
  const [formData, setFormData] = useState({
    category: '',
    opportunityType: 'internship',
    internshipType: 'daily',
    whenNeeded: '',
    startOption: 'specific_date', // specific_date, tomorrow, next_week
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
      paymentType: 'daily',
      includesTips: false
    },
    title: '',
    description: '',
    requirements: [''],
    benefits: [''],
    skillsGained: [''],
    certificate: { 
      willProvide: true, 
      requirements: { 
        minAttendance: 80, 
        completionTask: true, 
        feedback: true 
      } 
    },
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
      frequency: 'one_time'
    },
    { 
      value: 'weekly', 
      label: 'Weekly', 
      description: 'Regular help on specific days each week',
      icon: Calendar,
      frequency: 'regular'
    },
    { 
      value: 'weekend', 
      label: 'Weekends Only', 
      description: 'Regular help on Saturdays and Sundays',
      icon: Calendar,
      frequency: 'regular'
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

  const startOptions = [
    { value: 'specific_date', label: 'Specific Date' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'next_week', label: 'Next Week' }
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

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get next Monday's date in YYYY-MM-DD format
  const getNextMondayDate = () => {
    const nextMonday = new Date();
    const dayOfWeek = nextMonday.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    return nextMonday.toISOString().split('T')[0];
  };

  // Get current type details
  const getCurrentTypeDetails = () => {
    if (opportunityType === 'internship') {
      return internshipTypes.find(t => t.value === formData.internshipType);
    } else {
      return jobTypes.find(t => t.value === formData.internshipType);
    }
  };

  // Auto-set dates based on start option
  useEffect(() => {
    let newDate = '';
    
    switch (formData.startOption) {
      case 'tomorrow':
        newDate = getTomorrowDate();
        break;
      case 'next_week':
        newDate = getNextMondayDate();
        break;
      case 'specific_date':
      default:
        // Keep the existing date or set to today if empty
        newDate = formData.schedule.startDate || getTodayDate();
        break;
    }
    
    if (newDate && newDate !== formData.schedule.startDate) {
      handleNestedChange('schedule', 'startDate', newDate);
    }
  }, [formData.startOption]);

  // Auto-set job-specific values when job type changes
  useEffect(() => {
    if (opportunityType === 'job') {
      // Set payment frequency to monthly for jobs
      handleNestedChange('stipend', 'paymentType', 'monthly');
      
      // Set hours per day based on job type
      if (formData.internshipType === 'part_time') {
        handleNestedChange('schedule', 'hoursPerDay', 4);
      } else if (formData.internshipType === 'full_time') {
        handleNestedChange('schedule', 'hoursPerDay', 8);
      }
      
      // Set start option to specific_date for jobs
      handleInputChange('startOption', 'specific_date');
    } else {
      // For internships, set appropriate duration unit based on type
      if (formData.internshipType === 'daily') {
        handleInputChange('durationUnit', 'days');
      } else {
        handleInputChange('durationUnit', 'weeks');
      }
    }
  }, [opportunityType, formData.internshipType]);

  // Auto-generate title and description based on form data
  useEffect(() => {
    if (formData.category && (formData.internshipType || opportunityType === 'job')) {
      const typeDetails = getCurrentTypeDetails();
      
      // Generate title
      const newTitle = `${formData.category} - ${typeDetails?.label || ''}`;
      setFormData(prev => ({ ...prev, title: newTitle }));
      
      // Generate description
      let description = `We are looking for a ${formData.category.toLowerCase()} for ${opportunityType === 'internship' ? 'an internship' : 'a job'} on ${typeDetails?.label.toLowerCase()} basis. `;
      
      if (typeDetails?.frequency === 'one_time') {
        if (formData.whenNeeded) {
          description += `This opportunity starts on ${new Date(formData.whenNeeded).toLocaleDateString()}. `;
        }
      } else {
        // Regular opportunity
        if (formData.internshipType === 'weekend') {
          description += 'This is a regular opportunity on weekends (Saturday and Sunday). ';
        } else if (formData.specificDays.length > 0) {
          const days = formData.specificDays.map(day => 
            daysOfWeek.find(d => d.value === day)?.label
          ).join(', ');
          description += `This is a regular opportunity on ${days}. `;
        }
        
        if (formData.schedule.startDate) {
          description += `It starts from ${new Date(formData.schedule.startDate).toLocaleDateString()}. `;
        }
      }
      
      // Add duration information for internships only
      if (opportunityType === 'internship' && formData.duration > 0) {
        const unit = formData.duration === 1 ? formData.durationUnit.slice(0, -1) : formData.durationUnit;
        description += `Duration: ${formData.duration} ${unit}. `;
      }
      
      description += `We need ${formData.numberOfPeople} person(s) for this role. `;
      
      // Add hours information
      if (opportunityType === 'job' || formData.internshipType !== 'daily') {
        description += `Working hours: ${formData.schedule.hoursPerDay} hours per day. `;
      }
      
      if (formData.stipend.amount > 0) {
        description += `The ${opportunityType === 'internship' ? 'stipend' : 'salary'} offered is ₹${formData.stipend.amount} per ${formData.stipend.paymentType}.`;
        if (formData.stipend.includesTips) {
          description += ' Additional tips may be earned.';
        }
      } else {
        description += `This is ${opportunityType === 'internship' ? 'an unpaid internship with valuable learning experience' : 'a voluntary position'}.`;
      }
      
      setFormData(prev => ({ ...prev, description }));
    }
  }, [
    formData.category, 
    formData.internshipType, 
    formData.whenNeeded, 
    formData.specificDays,
    formData.schedule.startDate,
    formData.duration,
    formData.durationUnit,
    formData.numberOfPeople,
    formData.stipend.amount,
    formData.stipend.paymentType,
    formData.stipend.includesTips,
    formData.schedule.hoursPerDay,
    opportunityType
  ]);

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
      if (!formData.whenNeeded) {
        newErrors.whenNeeded = 'Please specify when you need help';
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
    
    if (formData.numberOfPeople <= 0) newErrors.numberOfPeople = 'At least 1 person is required';
    if (formData.numberOfPeople > 10) newErrors.numberOfPeople = 'Maximum 10 people allowed';
    
    if (formData.schedule.hoursPerDay <= 0 || formData.schedule.hoursPerDay > 12) {
      newErrors.hoursPerDay = 'Hours per day must be between 1-12';
    }
    
    if (formData.stipend.amount < 0) newErrors.stipendAmount = 'Amount cannot be negative';
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.trim().length < 50) newErrors.description = 'Description should be at least 50 characters';

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

    // Prepare final data
    const submitData = {
      ...formData,
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
        : 'border-soft focus:ring-primary'
    }`;

  const currentTypeDetails = getCurrentTypeDetails();
  const isOneTime = currentTypeDetails?.frequency === 'one_time';
  const isJob = opportunityType === 'job';
  const isWeeklyOrWeekend = formData.internshipType === 'weekly' || formData.internshipType === 'weekend';

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-dark hover:text-primary mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-dark">Create New Opportunity</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-soft p-6">
        <div className="space-y-8">
          
          {/* Section 0: Opportunity Type Selection */}
          <div className="bg-gray-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              What type of opportunity are you offering?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOpportunityType('internship')}
                className={`p-4 rounded-lg border flex flex-col items-center text-center ${
                  opportunityType === 'internship'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-soft text-dark hover:border-primary'
                }`}
              >
                <BookOpen className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium mb-1">Internship</span>
                <span className="text-xs opacity-75">Learning opportunity for students</span>
              </button>

              <button
                type="button"
                onClick={() => setOpportunityType('job')}
                className={`p-4 rounded-lg border flex flex-col items-center text-center ${
                  opportunityType === 'job'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-soft text-dark hover:border-primary'
                }`}
              >
                <Briefcase className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium mb-1">Job</span>
                <span className="text-xs opacity-75">Employment opportunity</span>
              </button>
            </div>
          </div>
          
          {/* Section 1: Basic Information */}
          <div className="bg-gray-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              What type of help do you need?
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
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
                <label className="block text-sm font-medium text-dark mb-2">
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
                        className={`p-3 rounded-lg border flex flex-col items-center text-center ${
                          formData.internshipType === type.value
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-soft text-dark hover:border-primary'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mb-2" />
                        <span className="text-sm font-medium mb-1">{type.label}</span>
                        <span className="text-xs opacity-75">{type.description}</span>
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

          {/* Section 2: Timing Details */}
          <div className="bg-gray-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              When do you need help?
            </h3>
            
            <div className="space-y-4">
              <div className="bg-primary-light p-3 rounded-md mb-4">
                <p className="text-primary text-sm">
                  <strong>Note:</strong> {isOneTime 
                    ? 'Daily Basis is for help on specific days' 
                    : isJob 
                      ? 'Jobs are ongoing employment opportunities'
                      : 'This is a regular opportunity that requires a start date'}
                </p>
              </div>

              {isOneTime ? (
                // One-time opportunity (Daily Basis)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.whenNeeded}
                      onChange={(e) => handleInputChange('whenNeeded', e.target.value)}
                      min={getTodayDate()}
                      className={inputClassName('whenNeeded')}
                    />
                    {errors.whenNeeded && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.whenNeeded}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
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
              ) : (
                // Regular opportunity (Weekly, Weekend, Full Time, Part Time)
                <>
                  {(formData.internshipType === 'weekly' || formData.internshipType === 'weekend') && (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Which days? *
                      </label>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                        {daysOfWeek.map(day => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDay(day.value)}
                            disabled={formData.internshipType === 'weekend' && !['saturday', 'sunday'].includes(day.value)}
                            className={`p-2 rounded-md text-sm font-medium ${
                              formData.specificDays.includes(day.value)
                                ? 'bg-primary-light text-primary border border-primary'
                                : 'bg-white text-dark border border-soft'
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        When to start? *
                      </label>
                      {isJob ? (
                        <input
                          type="date"
                          value={formData.schedule.startDate}
                          onChange={(e) => handleNestedChange('schedule', 'startDate', e.target.value)}
                          min={getTodayDate()}
                          className={inputClassName('startDate')}
                        />
                      ) : (
                        <select
                          value={formData.startOption}
                          onChange={(e) => handleInputChange('startOption', e.target.value)}
                          className={inputClassName('startOption')}
                        >
                          {startOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.startDate && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> {errors.startDate}
                        </p>
                      )}
                    </div>

                    {formData.startOption === 'specific_date' && !isJob && (
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Specific Start Date *
                        </label>
                        <input
                          type="date"
                          value={formData.schedule.startDate}
                          onChange={(e) => handleNestedChange('schedule', 'startDate', e.target.value)}
                          min={getTodayDate()}
                          className={inputClassName('startDate')}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Hours Per Day
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
                      <label className="block text-sm font-medium text-dark mb-2">
                        Shift Timing
                      </label>
                      <select
                        value={formData.schedule.shift}
                        onChange={(e) => handleNestedChange('schedule', 'shift', e.target.value)}
                        className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {shifts.map(shift => (
                          <option key={shift.value} value={shift.value}>
                            {shift.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Duration field - only for internships */}
              {!isJob && (
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Duration *
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max={formData.durationUnit === 'days' ? 30 : isWeeklyOrWeekend ? 4 : 12}
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                      className={`${inputClassName('duration')} w-24`}
                      placeholder="Duration"
                    />
                    <select
                      value={formData.durationUnit}
                      onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                      className="ml-2 px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                    </select>
                    <span className="ml-3 text-sm text-gray-500">
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
              )}
            </div>
          </div>

          {/* Section 3: Payment Details */}
          <div className="bg-gray-light p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Payment Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isJob ? 'Salary Amount (₹)' : 'Stipend Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stipend.amount}
                    onChange={(e) => handleNestedChange('stipend', 'amount', parseInt(e.target.value) || 0)}
                    className={inputClassName('stipendAmount')}
                    placeholder="0 for unpaid"
                  />
                  {errors.stipendAmount && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.stipendAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Payment Frequency
                  </label>
                  <select
                    value={formData.stipend.paymentType}
                    onChange={(e) => handleNestedChange('stipend', 'paymentType', e.target.value)}
                    className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="end">After Completion</option>
                  </select>
                  {isJob && (
                    <p className="text-xs text-gray-500 mt-1">
                      Jobs are typically paid monthly
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stipend.includesTips}
                    onChange={(e) => handleNestedChange('stipend', 'includesTips', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-soft rounded"
                  />
                  <span className="ml-2 text-sm text-dark">
                    Includes tips or extra benefits
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Auto-generated Details (Read-only) */}
          <div className="bg-green-light p-4 rounded-lg border border-green-custom">
            <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-custom" />
              {isJob ? 'Job Details' : 'Internship Details'} (Auto-generated)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isJob ? 'Job Title *' : 'Internship Title *'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={inputClassName('title')}
                  placeholder="Title will be auto-generated"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={inputClassName('description')}
                  placeholder="Description will be auto-generated based on your selections"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/50 characters
                </p>
              </div>

              <div className="bg-primary-light p-3 rounded-md">
                <p className="text-primary text-sm">
                  <strong>Note:</strong> Title and description are automatically created based on your selections. 
                  You can modify them if needed.
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

export default CreateInternship;