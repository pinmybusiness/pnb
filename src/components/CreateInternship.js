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
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const CreateInternship = () => {
  const router = useRouter();
const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    internshipType: 'daily',
    description: '',
    duration: { value: 1, unit: 'days' },
    schedule: { days: [], shift: 'flexible', hoursPerDay: 8 },
    startDate: '',
    deadline: '',
    stipend: { amount: 0, currency: 'INR', paymentType: 'daily' },
    positions: { total: 1, filled: 0 },
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    skillsGained: [''],
    certificate: { willProvide: true, requirements: { minAttendance: 80, completionTask: true, feedback: true } },
    tags: []
  });

  const categories = [
    'kitchen', 'service', 'management', 'marketing', 'events', 'delivery', 'other'
  ];

  console.log("user12", user.branch)

  const internshipTypes = [
    { value: 'daily', label: 'Daily Basis' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'weekend', label: 'Weekends Only' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'full_time', label: 'Full Time' }
  ];

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const shifts = [
    { value: 'morning', label: 'Morning (6AM - 2PM)' },
    { value: 'evening', label: 'Evening (2PM - 10PM)' },
    { value: 'night', label: 'Night (10PM - 6AM)' },
    { value: 'flexible', label: 'Flexible Hours' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is updated
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
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(day)
          ? prev.schedule.days.filter(d => d !== day)
          : [...prev.schedule.days, day]
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.trim().length < 50) newErrors.description = 'Description should be at least 50 characters';
    }

    if (step === 2) {
      if (!formData.deadline) newErrors.deadline = 'Deadline is required';
      if (formData.deadline && new Date(formData.deadline) <= new Date()) {
        newErrors.deadline = 'Deadline must be in the future';
      }
      if (formData.duration.value <= 0) newErrors.durationValue = 'Duration must be positive';
      if (formData.schedule.hoursPerDay <= 0 || formData.schedule.hoursPerDay > 12) {
        newErrors.hoursPerDay = 'Hours per day must be between 1-12';
      }
    }

    if (step === 3) {
      if (formData.stipend.amount < 0) newErrors.stipendAmount = 'Stipend cannot be negative';
      if (formData.positions.total <= 0) newErrors.positions = 'At least 1 position is required';
    }

    if (step === 4) {
      if (!formData.requirements[0]?.trim()) newErrors.requirements = 'At least one requirement is required';
      if (!formData.responsibilities[0]?.trim()) newErrors.responsibilities = 'At least one responsibility is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    // Add useEffect to check authentication
  useEffect(() => {
    if (!token && !authLoading) {
      toast.error('Please login first');
      router.push('/auth/login');
      return;
    }

    if (token && user) {
      // Auto-fill restaurant and branch from user data if available
      if (user.restaurant && !formData.restaurant) {
        setFormData(prev => ({ ...prev, restaurant: user.restaurant }));
      }
      if (user.branch && !formData.branch) {
        setFormData(prev => ({ ...prev, branch: user.branch }));
      }
    }
  }, [token, user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/internships`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Internship created successfully!');
        router.push('/dashboard/internships');
      }
    } catch (error) {
      console.error('Create internship error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create internship';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        toast.error('Please fix the validation errors');
        const fieldErrors = {};
        validationErrors.forEach(err => {
          if (err.toLowerCase().includes('title')) fieldErrors.title = err;
          else if (err.toLowerCase().includes('category')) fieldErrors.category = err;
          else if (err.toLowerCase().includes('description')) fieldErrors.description = err;
          else if (err.toLowerCase().includes('deadline')) fieldErrors.deadline = err;
          else fieldErrors.general = err;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const inputClassName = (field) => 
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      errors[field] 
        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
        : 'border-soft focus:ring-primary'
    }`;

  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Internship Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={inputClassName('title')}
          placeholder="e.g., Kitchen Assistant Intern, Service Crew Member"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" /> {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={inputClassName('category')}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
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
            Internship Type *
          </label>
          <select
            value={formData.internshipType}
            onChange={(e) => handleInputChange('internshipType', e.target.value)}
            className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {internshipTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
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
          placeholder="Describe the internship role, what the student will learn, etc."
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" /> {errors.description}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {formData.description.length}/50 characters minimum
        </p>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark">Duration & Schedule</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Duration Value *
          </label>
          <input
            type="number"
            min="1"
            value={formData.duration.value}
            onChange={(e) => handleNestedChange('duration', 'value', parseInt(e.target.value) || 1)}
            className={inputClassName('durationValue')}
          />
          {errors.durationValue && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.durationValue}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Duration Unit *
          </label>
          <select
            value={formData.duration.unit}
            onChange={(e) => handleNestedChange('duration', 'unit', e.target.value)}
            className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Application Deadline *
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            className={inputClassName('deadline')}
          />
          {errors.deadline && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.deadline}
            </p>
          )}
        </div>
      </div>

      {formData.internshipType !== 'daily' && (
        <>
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Working Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`p-2 rounded-md text-sm font-medium ${
                    formData.schedule.days.includes(day)
                      ? 'bg-primary-light text-primary border border-primary'
                      : 'bg-gray-light text-dark border border-soft'
                  }`}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                </button>
              ))}
            </div>
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
        </>
      )}

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
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark">Stipend & Positions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Stipend Amount (₹) *
          </label>
          <input
            type="number"
            min="0"
            value={formData.stipend.amount}
            onChange={(e) => handleNestedChange('stipend', 'amount', parseInt(e.target.value) || 0)}
            className={inputClassName('stipendAmount')}
          />
          {errors.stipendAmount && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.stipendAmount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Payment Type
          </label>
          <select
            value={formData.stipend.paymentType}
            onChange={(e) => handleNestedChange('stipend', 'paymentType', e.target.value)}
            className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="project">Project Basis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Number of Positions *
          </label>
          <input
            type="number"
            min="1"
            value={formData.positions.total}
            onChange={(e) => handleNestedChange('positions', 'total', parseInt(e.target.value) || 1)}
            className={inputClassName('positions')}
          />
          {errors.positions && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.positions}
            </p>
          )}
        </div>
      </div>

      <div className="bg-primary-light p-4 rounded-md border border-primary">
        <h4 className="font-medium text-primary mb-2">Stipend Information</h4>
        <p className="text-primary text-sm">
          {formData.stipend.amount === 0 
            ? 'This is an unpaid internship'
            : `₹${formData.stipend.amount} per ${formData.stipend.paymentType}`
          }
        </p>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark">Requirements & Benefits</h3>
      
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Requirements *
        </label>
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={req}
              onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Basic cooking knowledge, Good communication skills"
            />
            {formData.requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('requirements', index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {errors.requirements && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" /> {errors.requirements}
          </p>
        )}
        <button
          type="button"
          onClick={() => addArrayItem('requirements')}
          className="mt-2 flex items-center text-primary hover:text-primary/80"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Requirement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Responsibilities *
        </label>
        {formData.responsibilities.map((resp, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={resp}
              onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Assist in food preparation, Customer service"
            />
            {formData.responsibilities.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('responsibilities', index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {errors.responsibilities && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" /> {errors.responsibilities}
          </p>
        )}
        <button
          type="button"
          onClick={() => addArrayItem('responsibilities')}
          className="mt-2 flex items-center text-primary hover:text-primary/80"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Responsibility
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Benefits
        </label>
        {formData.benefits.map((benefit, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={benefit}
              onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Free meals, Training provided"
            />
            {formData.benefits.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('benefits', index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('benefits')}
          className="mt-2 flex items-center text-primary hover:text-primary/80"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Benefit
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Skills Gained
        </label>
        {formData.skillsGained.map((skill, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleArrayChange('skillsGained', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Food safety, Customer service, Teamwork"
            />
            {formData.skillsGained.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('skillsGained', index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('skillsGained')}
          className="mt-2 flex items-center text-primary hover:text-primary/80"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </button>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark">Certificate & Additional</h3>
      
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.certificate.willProvide}
            onChange={(e) => handleNestedChange('certificate', 'willProvide', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-soft rounded"
          />
          <span className="ml-2 text-sm font-medium text-dark">
            Provide completion certificate
          </span>
        </label>
      </div>

      {formData.certificate.willProvide && (
        <div className="bg-gray-light p-4 rounded-md border border-soft">
          <h4 className="font-medium text-dark mb-3">Certificate Requirements</h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.certificate.requirements.minAttendance > 0}
                onChange={(e) => handleNestedChange(
                  'certificate', 
                  'requirements', 
                  { ...formData.certificate.requirements, minAttendance: e.target.checked ? 80 : 0 }
                )}
                className="h-4 w-4 text-primary focus:ring-primary border-soft rounded"
              />
              <span className="ml-2 text-sm text-dark">Minimum Attendance</span>
            </label>

            {formData.certificate.requirements.minAttendance > 0 && (
              <div className="ml-6">
                <label className="block text-sm text-dark mb-1">
                  Minimum Attendance Percentage
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.certificate.requirements.minAttendance}
                  onChange={(e) => handleNestedChange(
                    'certificate', 
                    'requirements', 
                    { ...formData.certificate.requirements, minAttendance: parseInt(e.target.value) }
                  )}
                  className="w-24 px-2 py-1 border border-soft rounded-md"
                />
                <span className="ml-2 text-sm text-gray-500">%</span>
              </div>
            )}

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.certificate.requirements.completionTask}
                onChange={(e) => handleNestedChange(
                  'certificate', 
                  'requirements', 
                  { ...formData.certificate.requirements, completionTask: e.target.checked }
                )}
                className="h-4 w-4 text-primary focus:ring-primary border-soft rounded"
              />
              <span className="ml-2 text-sm text-dark">Completion Task Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.certificate.requirements.feedback}
                onChange={(e) => handleNestedChange(
                  'certificate', 
                  'requirements', 
                  { ...formData.certificate.requirements, feedback: e.target.checked }
                )}
                className="h-4 w-4 text-primary focus:ring-primary border-soft rounded"
              />
              <span className="ml-2 text-sm text-dark">Feedback Required</span>
            </label>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Tags (Optional)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
          className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., food, service, kitchen, customer-service"
        />
        <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Info', icon: BookOpen },
    { number: 2, title: 'Schedule', icon: Clock },
    { number: 3, title: 'Stipend', icon: DollarSign },
    { number: 4, title: 'Requirements', icon: Users },
    { number: 5, title: 'Certificate', icon: CheckCircle }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-dark mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-dark">Create New Internship</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-soft text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 ${
                  currentStep >= step.number ? 'text-primary font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex">
          {steps.slice(0, -1).map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={`h-1 transition-all duration-300 ${
                  currentStep > index + 1 ? 'bg-primary' : 'bg-gray-200'
                }`}
                style={{ width: currentStep > index + 1 ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-soft p-6">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-soft">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-soft rounded-md text-dark hover:bg-gray-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-custom text-white rounded-md hover:bg-green-custom/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Internship
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Step Indicator */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Step {currentStep} of 5
      </div>
    </div>
  );
};

export default CreateInternship;