'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  Eye,
  Edit,
  Users,
  Filter,
  X,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import KPICard from '@/components/ui/KPICard';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { formatDateWithSuffix } from '@/utils/dateFormat';
import {
  getOpportunityTypeText,
  getInternshipTypeText,
  getStipendText,
  getStatusText,
} from '@/utils/opportunity';
import { opportunityTypes, internshipTypes, jobTypes, statusOptions } from '@/data/opportunityData';

const Opportunities = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(-1);
  const [workTypeFilter, setWorkTypeFilter] = useState(''); // Use empty string for "All Work Types"
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState(-1);
  const [typeFilter, setTypeFilter] = useState(-1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user) return;

      try {
        setLoading(true);

        // Fetch opportunities
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`;
        if (user.branch) {
          url += `?branch=${user.branch}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOpportunities(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch opportunities');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  // Derive unique work type names from opportunities for the filter dropdown
  const workTypeOptions = [
    { value: '', label: 'All Work Types' },
    ...[...new Set(opportunities.map(op => op.workType?.name).filter(name => name))].map(name => ({
      value: name,
      label: name,
    })),
  ];

  const filteredAndSortedOpportunities = opportunities
    .filter((opportunity) => {
      const matchesSearch =
        opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opportunity?.workType?.name ?? 'Unknown Work Type')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === -1 || opportunity.status === statusFilter;
      const matchesWorkType = workTypeFilter === '' || opportunity?.workType?.name === workTypeFilter;
      const matchesOpportunityType =
        opportunityTypeFilter === -1 || opportunity.opportunityType === opportunityTypeFilter;
      const matchesType = typeFilter === -1 || opportunity.internshipType === typeFilter;

      return matchesSearch && matchesStatus && matchesWorkType && matchesOpportunityType && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'workType':
          aValue = a.workType?.name || 'Unknown Work Type';
          bValue = b.workType?.name || 'Unknown Work Type';
          break;
        case 'status':
          aValue = getStatusText(a.status) || '';
          bValue = getStatusText(b.status) || '';
          break;
        case 'opportunityType':
          aValue = getOpportunityTypeText(a.opportunityType) || '';
          bValue = getOpportunityTypeText(b.opportunityType) || '';
          break;
        case 'internshipType':
          aValue = getInternshipTypeText(a.internshipType) || '';
          bValue = getInternshipTypeText(b.internshipType) || '';
          break;
        case 'numberOfPeople':
          aValue = a.numberOfPeople || 0;
          bValue = b.numberOfPeople || 0;
          break;
        case 'stipend':
          aValue = a.stipend?.totalAmount || 0;
          bValue = b.stipend?.totalAmount || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'startDate':
          aValue = new Date(a.schedule?.startDate);
          bValue = new Date(b.schedule?.startDate);
          break;
        default:
          return 0;
      }

      if (aValue instanceof Date) {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const calculateKPIs = () => {
    if (opportunities.length === 0)
      return {
        total: 0,
        active: 0,
        totalPositions: 0,
        filledPositions: 0,
        avgStipend: 0,
      };

    const active = opportunities.filter((i) => i.status === 2).length;
    const totalPositions = opportunities.reduce((sum, i) => sum + (i.numberOfPeople || 0), 0);
    const filledPositions = opportunities.reduce((sum, i) => sum + (i.filledPositions || 0), 0);
    const avgStipend =
      opportunities.reduce((sum, i) => sum + (i.stipend?.totalAmount || 0), 0) / opportunities.length;

    return {
      total: opportunities.length,
      active,
      totalPositions,
      filledPositions,
      avgStipend: Math.round(avgStipend),
    };
  };

  const kpiData = calculateKPIs();

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-purple-100 text-purple-800';
      case 5: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOpportunityTypeIcon = (type) => {
    return type === 0 ? Briefcase : BookOpen;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Opportunity Management</h1>
          <p className="text-gray-500">Manage opportunities for your branch</p>
        </div>
        {[6, 7].includes(user?.role) && (
          <Link href="/dashboard/opportunities/add">
            <Button className="rounded-lg bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Opportunity
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard
          title="Total Opportunities"
          value={kpiData.total}
          icon={TrendingUp}
          className="bg-primary-light border-primary"
        />
        <KPICard
          title="Active"
          value={kpiData.active}
          icon={Users}
          className="bg-green-light border-green-custom"
        />
        <KPICard title="Total Positions" value={kpiData.totalPositions} icon={Users} />
        <KPICard
          title="Filled Positions"
          value={kpiData.filledPositions}
          icon={Users}
          className="bg-blue-50 border-blue-200"
        />
        <KPICard
          title="Avg Stipend"
          value={`₹${kpiData.avgStipend}`}
          icon={DollarSign}
          className="bg-amber-50 border-amber-200"
        />
      </div>

      <div className="bg-white rounded-lg border border-soft p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-soft rounded-md hover:bg-gray-light"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <X className="h-4 w-4" /> : null}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-light rounded-md">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Work Type</label>
              <select
                value={workTypeFilter}
                onChange={(e) => setWorkTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {workTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Opportunity Type</label>
              <select
                value={opportunityTypeFilter}
                onChange={(e) => setOpportunityTypeFilter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={-1}>All Types</option>
                {opportunityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Work Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={-1}>All Work Types</option>
                {[...jobTypes, ...internshipTypes].map((type) => (
                  <option key={type.value} value={type.backendValue}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light">
              <tr>
                <th
                  onClick={() => handleSort('title')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('workType')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Work Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('opportunityType')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('numberOfPeople')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Positions
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stipend')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Stipend/Salary
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('startDate')}
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Start Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-soft">
              {filteredAndSortedOpportunities.map((opportunity) => {
                const OpportunityTypeIcon = getOpportunityTypeIcon(opportunity.opportunityType);
                return (
                  <tr key={opportunity._id} className="hover:bg-gray-light">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-dark">{opportunity.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {opportunity.description?.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-secondary">
                        {opportunity?.workType?.name ?? 'Unknown Work Type'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <OpportunityTypeIcon className="h-4 w-4" />
                        <span>{getOpportunityTypeText(opportunity.opportunityType)}</span>
                        {opportunity.opportunityType === 1 && (
                          <>
                            <span>•</span>
                            <span>{getInternshipTypeText(opportunity.internshipType)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {opportunity.filledPositions || 0}/{opportunity.numberOfPeople || 0}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{
                            width: `${
                              ((opportunity.filledPositions || 0) / (opportunity.numberOfPeople || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-dark">{getStipendText(opportunity.stipend)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={getStatusText(opportunity.status)}
                        className={getStatusColor(opportunity.status)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {opportunity.schedule?.startDate
                          ? formatDateWithSuffix(opportunity.schedule.startDate)
                          : 'Not set'}
                      </div>
                      {opportunity.schedule?.startDate && (
                        <div className="text-xs text-gray-500">
                          {Math.ceil(
                            (new Date(opportunity.schedule.startDate) - new Date()) / (1000 * 60 * 60 * 24)
                          )}{' '}
                          days to start
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/opportunities/${opportunity._id}`)}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/opportunities/${opportunity._id}/edit`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedOpportunities.length === 0 && (
          <div className="p-12 text-center">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <TrendingUp className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-dark mb-2">No opportunities found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== -1 || workTypeFilter !== '' || opportunityTypeFilter !== -1 || typeFilter !== -1
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first opportunity'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Button component
const Button = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Opportunities;