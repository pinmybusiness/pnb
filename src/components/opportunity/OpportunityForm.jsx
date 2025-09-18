'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  Briefcase,
  Utensils,
  Home,
  Calculator,
  Globe,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import {
  languages,
  internshipTypes,
  jobTypes,
  daysOfWeek,
  shifts,
  durationUnits,
  fetchWorkTypes,
} from '@/data/opportunityData';
import { getStipendText } from '@/utils/opportunity';

const OpportunityForm = ({ editData = null, branchId }) => {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [opportunityType, setOpportunityType] = useState(0); // 0: job, 1: internship
  const [workTypes, setWorkTypes] = useState([]);
  const [hasManuallyEditedTitle, setHasManuallyEditedTitle] = useState(false);
  const [formData, setFormData] = useState({
    branch: branchId,
    workType: '',
    opportunityType: 0,
    internshipType: 0,
    numberOfPeople: 1,
    duration: 1,
    durationUnit: 0,
    schedule: {
      days: [],
      shift: 3,
      hoursPerDay: 8,
      startDate: '',
      endDate: '',
    },
    compensation: {
      minAmount: 0,
      maxAmount: 0,
      stipendAmount: 0,
      currency: 'INR',
      paymentType: 0, // Default to monthly for jobs
      includesTips: false,
      includesFood: false,
      includesAccommodation: false,
      benefits: [],
    },
    title: '',
    description: '',
    languages: {
      required: [],
      preferred: [2, 1],
    },
    tags: [],
  });
  const [originalWorkType, setOriginalWorkType] = useState('');
  const [originalInternshipType, setOriginalInternshipType] = useState('');
  const isEdit = Boolean(editData);

  useEffect(() => {
    const loadWorkTypes = async () => {
      try {
        const fetchedWorkTypes = await fetchWorkTypes(token);
        setWorkTypes(fetchedWorkTypes);
      } catch (error) {
        console.error('Error fetching work types:', error);
        toast.error('Failed to load work types');
      }
    };
    loadWorkTypes();
  }, [token]);

  useEffect(() => {
    if (editData) {
      const {
        workType,
        opportunityType,
        internshipType,
        numberOfPeople,
        duration,
        durationUnit,
        schedule,
        compensation,
        title,
        description,
        languages,
        tags,
      } = editData;

      const includesTips = compensation?.benefits?.includes(0) || false;
      const includesFood = compensation?.benefits?.includes(1) || false;
      const includesAccommodation = compensation?.benefits?.includes(2) || false;

      const workTypeId = workType?._id || workType || '';

      setFormData({
        branch: editData.branch || user?.branch,
        workType: workTypeId,
        opportunityType: opportunityType || 0,
        internshipType: internshipType || 0,
        numberOfPeople: numberOfPeople || 1,
        duration: duration || 1,
        durationUnit: durationUnit || 0,
        schedule: {
          days: schedule?.days || [],
          shift: schedule?.shift || 3,
          hoursPerDay: schedule?.hoursPerDay || 8,
          startDate: schedule?.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : '',
          endDate: schedule?.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : '',
        },
        compensation: {
          minAmount: compensation?.minAmount || 0,
          maxAmount: compensation?.maxAmount || 0,
          stipendAmount: compensation?.stipendAmount || 0,
          currency: compensation?.currency || 'INR',
          paymentType: compensation?.paymentType || (opportunityType === 0 ? 0 : 1),
          includesTips,
          includesFood,
          includesAccommodation,
          benefits: compensation?.benefits || [],
        },
        title: title || '',
        description: description || '',
        languages: {
          required: languages?.required || [],
          preferred: languages?.preferred || [2, 1],
        },
        tags: tags || [],
      });

      setOpportunityType(opportunityType || 0);
      setOriginalWorkType(workTypeId);
      setOriginalInternshipType(internshipType || '');
      setHasManuallyEditedTitle(!!title);
    }
  }, [editData, user?.branch]);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const calculateEndDate = (startDate, duration, durationUnit) => {
    if (!startDate) return '';

    const endDate = new Date(startDate);
    if (durationUnit === 0) {
      endDate.setDate(endDate.getDate() + duration);
    } else if (durationUnit === 1) {
      endDate.setDate(endDate.getDate() + (duration * 7));
    }
    return endDate.toISOString().split('T')[0];
  };

  const calculateTotalAmount = () => {
    if (opportunityType === 1) {
      if (formData.compensation.stipendAmount <= 0 || formData.duration <= 0) return 0;
      if (formData.durationUnit === 0) {
        return formData.compensation.stipendAmount * formData.duration;
      } else if (formData.durationUnit === 1) {
        let daysPerWeek = formData.schedule.days.length;
        if (formData.internshipType === 4) {
          daysPerWeek = 2;
        }
        return formData.compensation.stipendAmount * daysPerWeek * formData.duration;
      }
    }
    return formData.compensation.minAmount; // For jobs, return minAmount for display purposes
  };

  const getCurrentTypeDetails = () => {
    if (opportunityType === 1) {
      return internshipTypes.find((t) => t.backendValue === formData.internshipType);
    } else {
      return jobTypes.find((t) => t.backendValue === formData.internshipType);
    }
  };

  const handleLanguageToggle = (type, languageBackendValue, isChecked) => {
    setFormData((prev) => {
      const otherType = type === 'required' ? 'preferred' : 'required';
      const updatedLanguages = {
        ...prev.languages,
        [type]: isChecked
          ? [...prev.languages[type], languageBackendValue]
          : prev.languages[type].filter((lang) => lang !== languageBackendValue),
      };
      if (isChecked) {
        updatedLanguages[otherType] = updatedLanguages[otherType].filter(
          (lang) => lang !== languageBackendValue
        );
      }
      return {
        ...prev,
        languages: updatedLanguages,
      };
    });
  };

  useEffect(() => {
    if (opportunityType === 1) {
      const typeDetails = getCurrentTypeDetails();
      if (typeDetails?.durationUnit && durationUnits.find((du) => du.value === typeDetails.durationUnit).backendValue !== formData.durationUnit) {
        handleInputChange('durationUnit', durationUnits.find((du) => du.value === typeDetails.durationUnit).backendValue);
        if (formData.durationUnit !== durationUnits.find((du) => du.value === typeDetails.durationUnit).backendValue) {
          handleInputChange('duration', 1);
        }
      }
      handleNestedChange('compensation', 'paymentType', 1); // Internships: after_completion
    } else {
      handleNestedChange('compensation', 'paymentType', 0); // Jobs: monthly
      handleNestedChange('schedule', 'startDate', null);
      handleNestedChange('schedule', 'endDate', null);
    }
  }, [formData.internshipType, opportunityType]);

  useEffect(() => {
    if (opportunityType === 0) {
      if (formData.internshipType === 1) {
        handleNestedChange('schedule', 'hoursPerDay', 4);
      } else if (formData.internshipType === 0) {
        handleNestedChange('schedule', 'hoursPerDay', 8);
      }
    }
  }, [opportunityType, formData.internshipType]);

  useEffect(() => {
    if (formData.schedule.startDate && formData.duration > 0 && opportunityType === 1) {
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

  useEffect(() => {
    if (formData.internshipType === 4) {
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          days: [5, 6],
        },
      }));
    } else if (formData.internshipType === 3) {
      if (formData.schedule.days.length === 0) {
        setFormData((prev) => ({
          ...prev,
          schedule: {
            ...prev.schedule,
            days: [5],
          },
        }));
      }
    }
  }, [formData.internshipType]);

  useEffect(() => {
    if (opportunityType === 1 && formData.internshipType === 3 && formData.schedule.days.length > 0) {
      const today = new Date();
      const todayDay = today.getDay();
      const dayNumbers = daysOfWeek.map((day) => day.backendValue);

      let daysToAdd = 0;
      let found = false;

      for (let i = 0; i < 14; i++) {
        const checkDay = (todayDay + i) % 7;
        if (formData.schedule.days.includes(dayNumbers[checkDay])) {
          daysToAdd = i;
          found = true;
          break;
        }
      }

      if (found) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + daysToAdd);
        if (startDate.toISOString().split('T')[0] !== formData.schedule.startDate) {
          handleNestedChange('schedule', 'startDate', startDate.toISOString().split('T')[0]);
        }
      }
    }
  }, [formData.schedule.days, formData.internshipType, opportunityType]);

  useEffect(() => {
    if (opportunityType === 0 && formData.internshipType === 1) {
      handleNestedChange('schedule', 'hoursPerDay', 4);
    }
  }, [formData.internshipType, opportunityType]);

  useEffect(() => {
    if (
      formData.workType &&
      (formData.internshipType !== undefined || opportunityType === 0) &&
      (!isEdit || formData.workType !== originalWorkType || formData.internshipType !== originalInternshipType) &&
      !hasManuallyEditedTitle
    ) {
      const typeDetails = getCurrentTypeDetails();
      const selectedWorkType = workTypes.find((wt) => wt.value === formData.workType);
      const newTitle = `${selectedWorkType?.label || 'Unknown Work Type'} - ${typeDetails?.label || ''}`;
      setFormData((prev) => ({ ...prev, title: newTitle }));
    }
  }, [formData.workType, formData.internshipType, opportunityType, isEdit, originalWorkType, originalInternshipType, workTypes, hasManuallyEditedTitle]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === 'title') {
      setHasManuallyEditedTitle(true);
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
    if (errors[`${parent}.${field}`]) {
      setErrors((prev) => ({ ...prev, [`${parent}.${field}`]: '' }));
    }
  };

  const toggleDay = (day) => {
    const backendDay = daysOfWeek.find((d) => d.value === day).backendValue;
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(backendDay)
          ? prev.schedule.days.filter((d) => d !== backendDay)
          : [...prev.schedule.days, backendDay],
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.workType || !workTypes.find((wt) => wt.value === formData.workType)) {
      newErrors.workType = 'Please select a valid work type';
    }
    if (formData.internshipType === undefined) {
      newErrors.internshipType = 'Type is required';
    }

    const typeDetails = getCurrentTypeDetails();

    if (opportunityType === 1) {
      if (typeDetails?.frequency === 'one_time') {
        if (!formData.schedule.startDate) {
          newErrors.startDate = 'Please specify a start date';
        }
      } else {
        if (formData.internshipType === 3 && formData.schedule.days.length === 0) {
          newErrors.days = 'Please select at least one day';
        }
        if (!formData.schedule.startDate) {
          newErrors.startDate = 'Please specify a start date';
        }
        if (formData.schedule.startDate && new Date(formData.schedule.startDate) < new Date()) {
          newErrors.startDate = 'Start date cannot be in the past';
        }
      }

      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration = 'Duration must be at least 1';
        handleInputChange('duration', 1);
      } else if (formData.durationUnit === 0 && formData.duration > 30) {
        newErrors.duration = 'Duration must be between 1-30 days';
      } else if (formData.durationUnit === 1) {
        const maxWeeks = (formData.internshipType === 3 || formData.internshipType === 4) ? 4 : 12;
        if (formData.duration > maxWeeks) {
          newErrors.duration = `Duration must be between 1-${maxWeeks} weeks`;
        }
      }

      if (!formData.compensation.stipendAmount || formData.compensation.stipendAmount <= 0) {
        newErrors.stipendAmount = 'Stipend amount is required';
        handleNestedChange('compensation', 'stipendAmount', 0);
      }
    } else {
      if (!formData.compensation.minAmount || formData.compensation.minAmount <= 0) {
        newErrors.minAmount = 'Minimum salary is required';
        handleNestedChange('compensation', 'minAmount', 0);
      }
      if (!formData.compensation.maxAmount || formData.compensation.maxAmount <= 0) {
        newErrors.maxAmount = 'Maximum salary is required';
        handleNestedChange('compensation', 'maxAmount', 0);
      }
      if (formData.compensation.maxAmount < formData.compensation.minAmount) {
        newErrors.maxAmount = 'Maximum salary must be greater than or equal to minimum salary';
      }
    }

    if (!formData.numberOfPeople || formData.numberOfPeople <= 0) {
      newErrors.numberOfPeople = 'At least 1 person is required';
      handleInputChange('numberOfPeople', 1);
    }
    if (formData.numberOfPeople > 10) {
      newErrors.numberOfPeople = 'Maximum 10 people allowed';
    }

    if (!formData.schedule.hoursPerDay || formData.schedule.hoursPerDay <= 0) {
      newErrors.hoursPerDay = 'Hours per day must be at least 1';
      handleNestedChange('schedule', 'hoursPerDay', 1);
    }
    if (formData.schedule.hoursPerDay > 12) {
      newErrors.hoursPerDay = 'Hours per day must be between 1-12';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

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

    const selectedWorkType = workTypes.find((wt) => wt.value === formData.workType);
    if (!selectedWorkType) {
      toast.error('Please select a valid work type');
      return;
    }

    const benefits = [];
    if (formData.compensation.includesTips) benefits.push(0);
    if (formData.compensation.includesFood) benefits.push(1);
    if (formData.compensation.includesAccommodation) benefits.push(2);

    const finalAmount = calculateTotalAmount();
    const submitData = {
      ...formData,
      workTypeSlug: selectedWorkType.slug,
      opportunityType,
      compensation: {
        minAmount: opportunityType === 0 ? formData.compensation.minAmount : undefined,
        maxAmount: opportunityType === 0 ? formData.compensation.maxAmount : undefined,
        stipendAmount: opportunityType === 1 ? formData.compensation.stipendAmount : undefined,
        currency: formData.compensation.currency,
        paymentType: opportunityType === 0 ? 0 : 1, // 0: monthly for jobs, 1: after_completion for internships
        totalAmount: finalAmount,
        benefits,
      },
      isJob: opportunityType === 0,
      schedule: {
        ...formData.schedule,
        ...(opportunityType === 0
          ? { startDate: null, endDate: null }
          : { startDate: formData.schedule.startDate, endDate: formData.schedule.endDate }),
      },
    };

    delete submitData.workType;

    setLoading(true);
    try {
      let response;
      if (isEdit) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${editData._id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          `${opportunityType === 0 ? 'Job' : 'Internship'} ${
            isEdit ? 'updated' : 'created'
          } successfully!`
        );
        if ([0, 1, 2].includes(user?.role)) {
          router.back();
        } else {
          router.push('/dashboard/opportunities');
        }
      }
    } catch (error) {
      console.error(`${isEdit ? 'Update' : 'Create'} opportunity error:`, error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEdit ? 'update' : 'create'} ${opportunityType === 0 ? 'job' : 'internship'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-300 focus:ring-red-500 bg-red-50'
        : 'border-gray-300 focus:ring-blue-500'
    }`;

  const customSelectStyles = {
    control: (provided, state) => ({
      ...

provided,
      border: errors.workType ? '1px solid #f87171' : '1px solid #d1d5db',
      backgroundColor: errors.workType ? '#fef2f2' : '#fff',
      borderRadius: '0.375rem',
      padding: '0.25rem',
      boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
      '&:hover': {
        borderColor: errors.workType ? '#f87171' : '#93c5fd',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : '#fff',
      color: state.isSelected ? '#fff' : '#1f2937',
      '&:hover': {
        backgroundColor: '#f3f4f6',
      },
    }),
  };

  const currentTypeDetails = getCurrentTypeDetails();
  const isJob = opportunityType === 0;
  const isWeeklyOrWeekend = formData.internshipType === 3 || formData.internshipType === 4;
  const totalAmount = calculateTotalAmount();

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit' : 'Create'} Opportunity
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            Opportunity Type
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOpportunityType(0)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center text-center transition-all ${
                opportunityType === 0
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <Briefcase className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">Job</span>
              <span className="text-xs text-gray-500 hidden sm:block">Employment opportunity</span>
            </button>
            <button
              type="button"
              onClick={() => setOpportunityType(1)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center text-center transition-all ${
                opportunityType === 1
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">Internship</span>
              <span className="text-xs text-gray-500 hidden sm:block">Learning opportunity</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Help Needed
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isJob ? 'Job Type *' : 'Internship Type *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(isJob ? jobTypes : internshipTypes).map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.backendValue}
                      type="button"
                      onClick={() => handleInputChange('internshipType', type.backendValue)}
                      className={`p-2 rounded-lg border-2 flex items-center justify-center gap-1 text-center transition-all text-sm ${
                        formData.internshipType === type.backendValue
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{type.label}</span>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Type *
              </label>
              <Select
                options={workTypes}
                value={workTypes.find((option) => option.value === formData.workType) || null}
                onChange={(selectedOption) => handleInputChange('workType', selectedOption ? selectedOption.value : '')}
                placeholder="Select work type"
                isSearchable
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
              {errors.workType && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.workType}
                </p>
                )}
            </div>
          </div>
        </div>

        {!isJob && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Duration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={formData.durationUnit === 0 ? 30 : isWeeklyOrWeekend ? 4 : 12}
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value === '' ? '' : parseInt(e.target.value))}
                    onBlur={(e) => {
                      if (e.target.value === '' || parseInt(e.target.value) < 1) {
                        handleInputChange('duration', 1);
                      }
                    }}
                    className={`${inputClassName('duration')} w-full sm:w-24`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {durationUnits.find((du) => du.backendValue === formData.durationUnit)?.label || 'Days'}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {formData.durationUnit === 0
                      ? 'Max 30 days'
                      : isWeeklyOrWeekend
                        ? 'Max 4 weeks'
                        : 'Max 12 weeks'}
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

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Schedule
          </h3>
          <div className="space-y-4">
            {(formData.internshipType === 3 || formData.internshipType === 4) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.backendValue}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      disabled={formData.internshipType === 4 && ![5, 6].includes(day.backendValue)}
                      className={`p-2 rounded-md text-sm font-medium transition-colors ${
                        formData.schedule.days.includes(day.backendValue)
                          ? 'bg-blue-500 text-white border border-blue-500'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      } ${
                        formData.internshipType === 4 && ![5, 6].includes(day.backendValue)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {day.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
                {errors.days && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.days}
                  </p>
                )}
              </div>
            )}
            {!isJob && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.schedule.startDate || ''}
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
                {formData.schedule.startDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.schedule.endDate || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                      Calculated based on start date and duration
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours/Day *
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.schedule.hoursPerDay}
                  onChange={(e) => handleNestedChange('schedule', 'hoursPerDay', e.target.value === '' ? '' : parseInt(e.target.value))}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      handleNestedChange('schedule', 'hoursPerDay', 1);
                    }
                  }}
                  className={inputClassName('hoursPerDay')}
                />
                {errors.hoursPerDay && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.hoursPerDay}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift *
                </label>
                <select
                  value={shifts.find((s) => s.backendValue === formData.schedule.shift)?.value || 'flexible'}
                  onChange={(e) => handleNestedChange('schedule', 'shift', shifts.find((s) => s.value === e.target.value).backendValue)}
                  className={inputClassName('shift')}
                >
                  {shifts.map((shift) => (
                    <option key={shift.backendValue} value={shift.value}>
                      {shift.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                People Needed *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.numberOfPeople}
                onChange={(e) => handleInputChange('numberOfPeople', e.target.value === '' ? '' : parseInt(e.target.value))}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value) < 1) {
                    handleInputChange('numberOfPeople', 1);
                  }
                }}
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

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            Payment
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isJob ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary (₹/month) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.compensation.minAmount}
                      onChange={(e) => handleNestedChange('compensation', 'minAmount', e.target.value === '' ? '' : parseInt(e.target.value))}
                      onBlur={(e) => {
                        if (e.target.value === '' || parseInt(e.target.value) < 0) {
                          handleNestedChange('compensation', 'minAmount', 0);
                        }
                      }}
                      className={inputClassName('minAmount')}
                      placeholder="Enter minimum salary"
                    />
                    {errors.minAmount && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.minAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary (₹/month) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.compensation.maxAmount}
                      onChange={(e) => handleNestedChange('compensation', 'maxAmount', e.target.value === '' ? '' : parseInt(e.target.value))}
                      onBlur={(e) => {
                        if (e.target.value === '' || parseInt(e.target.value) < 0) {
                          handleNestedChange('compensation', 'maxAmount', 0);
                        }
                      }}
                      className={inputClassName('maxAmount')}
                      placeholder="Enter maximum salary"
                    />
                    {errors.maxAmount && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.maxAmount}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stipend (₹/day) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.compensation.stipendAmount}
                    onChange={(e) => handleNestedChange('compensation', 'stipendAmount', e.target.value === '' ? '' : parseInt(e.target.value))}
                    onBlur={(e) => {
                      if (e.target.value === '' || parseInt(e.target.value) < 0) {
                        handleNestedChange('compensation', 'stipendAmount', 0);
                      }
                    }}
                    className={inputClassName('stipendAmount')}
                    placeholder="Enter stipend amount"
                  />
                  {errors.stipendAmount && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.stipendAmount}
                    </p>
                  )}
                  {formData.compensation.stipendAmount > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-center text-blue-700">
                        <Calculator className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          Total: {getStipendText({ ...formData.compensation, totalAmount })}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1 hidden sm:block">
                        {formData.duration} {durationUnits.find((du) => du.backendValue === formData.durationUnit)?.label || 'Days'} × ₹{formData.compensation.stipendAmount}/day
                        {formData.durationUnit === 1 && formData.schedule.days.length > 0 &&
                          ` × ${formData.schedule.days.length} days/week`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.compensation.includesTips}
                  onChange={(e) => handleNestedChange('compensation', 'includesTips', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Tips</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.compensation.includesFood}
                  onChange={(e) => handleNestedChange('compensation', 'includesFood', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Utensils className="h-4 w-4 mr-1" /> Food
                </span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.compensation.includesAccommodation}
                  onChange={(e) => handleNestedChange('compensation', 'includesAccommodation', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Home className="h-4 w-4 mr-1" /> Accommodation
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-600" />
            Languages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required
              </label>
              <div className="space-y-2">
                {languages.map((language) => {
                  const isPreferred = formData.languages.preferred.includes(language.backendValue);
                  return (
                    <div key={language.backendValue} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.languages.required.includes(language.backendValue)}
                        onChange={(e) => handleLanguageToggle('required', language.backendValue, e.target.checked)}
                        disabled={isPreferred}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                          isPreferred ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                      <span className={`ml-2 text-sm ${isPreferred ? 'text-gray-400' : 'text-gray-700'}`}>
                        {language.label}
                        {isPreferred && <span className="hidden sm:inline"> (Preferred)</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred
              </label>
              <div className="space-y-2">
                {languages.map((language) => {
                  const isRequired = formData.languages.required.includes(language.backendValue);
                  return (
                    <div key={language.backendValue} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.languages.preferred.includes(language.backendValue)}
                        onChange={(e) => handleLanguageToggle('preferred', language.backendValue, e.target.checked)}
                        disabled={isRequired}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                          isRequired ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                      <span className={`ml-2 text-sm ${isRequired ? 'text-gray-400' : 'text-gray-700'}`}>
                        {language.label}
                        {isRequired && <span className="hidden sm:inline"> (Required)</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Title is auto-generated but can be modified
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the opportunity..."
              />
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {formData.description.length} characters
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEdit ? 'Update' : 'Create'} {isJob ? 'Job' : 'Internship'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;