'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { Card, Button, Input } from '@/components/ui';

export default function CategoryModal({ onClose, onSave, selectedCategory, selectedOption, categories, defaultOptionMode }) {
  const [isCategoryMode, setIsCategoryMode] = useState(
    !defaultOptionMode || categories.length === 0 || !!selectedCategory
  );
  const [categoryLabel, setCategoryLabel] = useState(selectedCategory?.label || '');
  const [optionLabel, setOptionLabel] = useState(selectedOption?.label || '');
  const [selectedCategoryForOption, setSelectedCategoryForOption] = useState(
    selectedOption ? { value: selectedCategory.label, label: selectedCategory.label } : null
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = categories.map(cat => ({ value: cat.label, label: cat.label }));

  useEffect(() => {
    if (selectedOption) {
      setIsCategoryMode(false);
      setCategoryLabel(selectedCategory.label);
      setOptionLabel(selectedOption.label);
      setSelectedCategoryForOption({ value: selectedCategory.label, label: selectedCategory.label });
    } else if (selectedCategory) {
      setIsCategoryMode(true);
      setCategoryLabel(selectedCategory.label);
      setOptionLabel('');
      setSelectedCategoryForOption(null);
    } else {
      setIsCategoryMode(categories.length === 0);
      setCategoryLabel('');
      setOptionLabel('');
      setSelectedCategoryForOption(null);
    }
  }, [selectedCategory, selectedOption, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isCategoryMode) {
        if (selectedCategory) {
          // Update category
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/work-categories/category/${encodeURIComponent(selectedCategory.label)}`,
            { newLabel: categoryLabel }
          );
          toast.success('Category updated successfully');
        } else {
          // Create category
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/work-categories/category`, { label: categoryLabel });
          toast.success('Category created successfully');
        }
      } else {
        if (selectedOption) {
          // Update option
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/work-categories/option/${selectedOption.id}`,
            { label: optionLabel }
          );
          toast.success('Option updated successfully');
        } else {
          // Create option
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/work-categories/category/${encodeURIComponent(selectedCategoryForOption.value)}/option`,
            { label: optionLabel }
          );
          toast.success('Option created successfully');
        }
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isCategoryMode ? (selectedCategory ? 'Update Category' : 'Add Category') : (selectedOption ? 'Update Option' : 'Add Option')}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isCategoryMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Label
              </label>
              <Input
                value={categoryLabel}
                onChange={(e) => setCategoryLabel(e.target.value)}
                placeholder="Enter category label"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </label>
                <Select
                  options={categoryOptions}
                  value={selectedCategoryForOption}
                  onChange={setSelectedCategoryForOption}
                  placeholder="Select category..."
                  isDisabled={!!selectedOption}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option Label
                </label>
                <Input
                  value={optionLabel}
                  onChange={(e) => setOptionLabel(e.target.value)}
                  placeholder="Enter option label"
                  required
                  disabled={!selectedCategoryForOption}
                />
              </div>
            </>
          )}
          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => setIsCategoryMode(!isCategoryMode)}
            >
              Switch to {isCategoryMode ? 'Option' : 'Category'} Mode
            </Button>
            <Button type="submit" disabled={isLoading || (!isCategoryMode && !selectedCategoryForOption)}>
              {isLoading ? 'Saving...' : (isCategoryMode ? (selectedCategory ? 'Update' : 'Add') : (selectedOption ? 'Update' : 'Add'))}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}