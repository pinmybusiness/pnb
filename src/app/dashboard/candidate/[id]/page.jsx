"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Mail,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Tag,
  User,
  Home,
  GraduationCap,
  Languages,
  DollarSign,
  Clock as ClockIcon,
  ArrowLeft,
  Search,
  Binoculars,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CandidateProfilePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const params = useParams();
  const userId = params.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!token) {
          throw new Error('Please log in to view profiles');
        }
        if (user.role !== 6) {
          throw new Error('Only restaurant managers can view candidate profiles');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/candidates/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch candidate profile');
        }
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token, user.role]);

  // Function to calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Not specified';
    const dob = new Date(dateOfBirth);
    const today = new Date('2025-08-29'); // Current date as of 11:11 PM IST, August 29, 2025
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  // Job Status styling
  const getJobStatusStyles = (status) => {
    switch (status) {
      case 'Actively Looking':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: <Binoculars className="h-5 w-5 text-green-600" />,
        };
      case 'Open to Opportunities':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          icon: <Search className="h-5 w-5 text-amber-600" />,
        };
      case 'Not Looking':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: <Briefcase className="h-5 w-5 text-gray-600" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3 animate-pulse">
          <Briefcase className="h-6 w-6 text-orange-500" />
          <p className="text-lg">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No profile data available</p>
      </div>
    );
  }

  const jobStatusStyles = getJobStatusStyles(profile.jobStatus);

  return (
       <div className="space-y-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="h-7 w-7 text-orange-600" />
            {profile.firstName} {profile.lastName || ''}’s Profile
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Candidates
          </button>
        </div>

        <div className="space-y-10">
          {/* Personal Details */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{profile.firstName} {profile.lastName || ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span>{profile.email}</span>
              </div>
              {profile.mobileNumber && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-orange-500" />
                  <span>{profile.mobileNumber.countryCode} {profile.mobileNumber.number}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span>Age: {calculateAge(profile.dateOfBirth)}</span>
              </div>
              {profile.gender && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-orange-500" />
                  <span>{profile.gender}</span>
                </div>
              )}
            </div>
          </section>

          {/* Current City */}
          {profile.address?.city && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Current City
              </h2>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span>{profile.address.city}</span>
              </div>
            </section>
          )}

          {/* Job Status */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
              Job Status
            </h2>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${jobStatusStyles.bg} ${jobStatusStyles.text} text-sm font-medium`}>
              {jobStatusStyles.icon}
              <span className="ml-2">{profile.jobStatus || 'Not specified'}</span>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
              Skills
            </h2>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    {skill.name} ({skill.proficiency})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No skills listed</p>
            )}
          </section>

          {/* Education */}
          {profile.education?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Education
              </h2>
              <div className="space-y-5">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-orange-300 pl-4">
                    <p className="font-medium text-gray-900 text-base">{edu.degree || 'Untitled Degree'}</p>
                    <p className="text-sm text-gray-600">{edu.institution || 'Unknown Institution'}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startYear || 'Unknown'} - {edu.currentlyStudying ? 'Present' : (edu.endYear || 'Unknown')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Work Experience
              </h2>
              <div className="space-y-5">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-orange-300 pl-4">
                    <p className="font-medium text-gray-900 text-base">{exp.position || 'Untitled Position'}</p>
                    <p className="text-sm text-gray-600">{exp.company || 'Unknown Company'}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'} -{' '}
                      {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description || 'No description provided'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {profile.languages?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Languages
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    {lang.name} ({lang.proficiency})
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Preferences */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
              Job Preferences
            </h2>
            <div className="space-y-5">
              {profile.preferredLocations?.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Preferred Locations</p>
                  <div className="flex flex-wrap gap-3">
                    {profile.preferredLocations.map((location, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No preferred locations specified</p>
              )}
              {profile.preferredJobRoles?.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Preferred Job Roles</p>
                  <div className="flex flex-wrap gap-3">
                    {profile.preferredJobRoles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No preferred job roles specified</p>
              )}
              {profile.preferredOpportunityTypes?.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Preferred Opportunity Types</p>
                  <div className="flex flex-wrap gap-3">
                    {profile.preferredOpportunityTypes.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No preferred opportunity types specified</p>
              )}
            </div>
          </section>

          {/* Expected Salary */}
          {profile.expectedSalary && (profile.expectedSalary.min || profile.expectedSalary.max) && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Expected Salary
              </h2>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <DollarSign className="h-5 w-5 text-orange-500" />
                <span>
                  {profile.expectedSalary.min ? profile.expectedSalary.min.toLocaleString('en-IN') : 'N/A'} -{' '}
                  {profile.expectedSalary.max ? profile.expectedSalary.max.toLocaleString('en-IN') : 'N/A'} {profile.expectedSalary.currency}
                </span>
              </div>
            </section>
          )}

          {/* Notice Period */}
          {profile.noticePeriod && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Notice Period
              </h2>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <ClockIcon className="h-5 w-5 text-orange-500" />
                <span>{profile.noticePeriod} days</span>
              </div>
            </section>
          )}

          {/* Summary */}
          {profile.summary && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
                Summary
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{profile.summary}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;