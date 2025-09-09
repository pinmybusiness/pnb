'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, ArrowUpDown, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import CategoryModal from '@/components/opportunity/CategoryModal';

export default function WorkCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sortBy, setSortBy] = useState('category');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/work-categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setSelectedOption(null);
    setIsModalOpen(true);
  };

  const handleEditOption = (category, option) => {
    setSelectedCategory(category);
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Flatten categories into an option-wise list
  const optionsList = categories.flatMap(category =>
    category.options.map(option => ({
      category: category.label,
      ...option,
    }))
  );

  // Filter and sort options
  const filteredAndSortedOptions = optionsList
    .filter(option =>
      option.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'label':
          aValue = a.label || '';
          bValue = b.label || '';
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          return 0;
      }
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Categories Management</h1>
          <p className="text-gray-500">Manage work categories for opportunities</p>
        </div>
        <Button onClick={() => { setSelectedCategory(null); setSelectedOption(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category/Option
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories or options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Options Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Category
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('label')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Option Label
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Option ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Option Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOptions.map((option) => (
              <TableRow key={`${option.category}-${option.id}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {option.category}
                    <button
                      onClick={() => handleEditCategory(categories.find(cat => cat.label === option.category))}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Category"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>{option.label}</TableCell>
                <TableCell>{option.id}</TableCell>
                <TableCell>{option.value}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleEditOption(
                      categories.find(cat => cat.label === option.category),
                      option
                    )}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                    title="Edit Option"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAndSortedOptions.length === 0 && (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No options found' : 'No options available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding a category or option'}
            </p>
          </div>
        )}
      </Card>

      {isModalOpen && (
        <CategoryModal
          onClose={() => setIsModalOpen(false)}
          onSave={fetchCategories}
          selectedCategory={selectedCategory}
          selectedOption={selectedOption}
          categories={categories}
          defaultOptionMode={true}
        />
      )}
    </div>
  );
}