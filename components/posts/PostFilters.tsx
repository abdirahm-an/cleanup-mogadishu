'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface District {
  id: string;
  name: string;
  postCount: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  districtId: string;
  postCount: number;
}

interface PostFiltersProps {
  className?: string;
}

export default function PostFilters({ className }: PostFiltersProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedDistrictId = searchParams.get('district');
  const selectedNeighborhoodId = searchParams.get('neighborhood');
  const selectedStatus = searchParams.get('status');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const sortBy = searchParams.get('sort') || 'newest';

  // Load districts with post counts
  const loadDistricts = useCallback(async () => {
    try {
      setLoadingDistricts(true);
      const response = await fetch('/api/locations/districts?includeCounts=true');
      const data = await response.json();
      
      if (data.success) {
        setDistricts(data.districts);
      } else {
        console.error('Failed to load districts:', data.error);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  // Load neighborhoods with post counts
  const loadNeighborhoods = useCallback(async (districtId: string) => {
    try {
      setLoadingNeighborhoods(true);
      const response = await fetch(`/api/locations/neighborhoods?districtId=${districtId}&includeCounts=true`);
      const data = await response.json();
      
      if (data.success) {
        setNeighborhoods(data.neighborhoods);
      } else {
        console.error('Failed to load neighborhoods:', data.error);
        setNeighborhoods([]);
      }
    } catch (error) {
      console.error('Error loading neighborhoods:', error);
      setNeighborhoods([]);
    } finally {
      setLoadingNeighborhoods(false);
    }
  }, []);

  useEffect(() => {
    loadDistricts();
  }, [loadDistricts]);

  useEffect(() => {
    if (selectedDistrictId) {
      loadNeighborhoods(selectedDistrictId);
    } else {
      setNeighborhoods([]);
    }
  }, [selectedDistrictId, loadNeighborhoods]);

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    
    // Reset page to 1 when filters change
    current.delete('page');
    
    // Navigate with new params
    const newUrl = current.toString() ? `?${current.toString()}` : '/posts';
    router.push(`/posts${newUrl}`);
  }, [router, searchParams]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value || null;
    updateFilters({
      district: districtId,
      neighborhood: null, // Reset neighborhood when district changes
    });
  };

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const neighborhoodId = e.target.value || null;
    updateFilters({ neighborhood: neighborhoodId });
  };

  const handleStatusChange = (status: string | null) => {
    updateFilters({ status });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value || null;
    updateFilters({ dateFrom: dateValue });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value || null;
    updateFilters({ dateTo: dateValue });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value || 'newest';
    updateFilters({ sort: sortValue });
  };

  const clearFilters = () => {
    router.push('/posts');
  };

  const hasActiveFilters = selectedDistrictId || selectedNeighborhoodId || selectedStatus || dateFrom || dateTo || (sortBy && sortBy !== 'newest');

  const statusOptions = [
    { value: 'PUBLISHED', label: 'Open', color: 'bg-green-500', count: 0 },
    { value: 'UNDER_REVIEW', label: 'In Progress', color: 'bg-yellow-500', count: 0 },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-500', count: 0 },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', className)}>
      {/* Collapsible header for mobile */}
      <div className="flex items-center justify-between p-4 md:p-6 md:pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filter Posts</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Collapsible content */}
      <div className={cn('transition-all duration-200', isCollapsed ? 'hidden md:block' : 'block', 'px-4 pb-4 md:px-6 md:pb-6')}>
        <div className="space-y-6">
          {/* Status Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange(null)}
                className={cn(
                  'inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors',
                  !selectedStatus 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                All Posts
              </button>
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedStatus === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full', option.color)} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="date-from" className="block text-xs text-gray-600 mb-1">
                  From
                </label>
                <input
                  id="date-from"
                  type="date"
                  value={dateFrom || ''}
                  onChange={handleDateFromChange}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500'
                  )}
                />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-xs text-gray-600 mb-1">
                  To
                </label>
                <input
                  id="date-to"
                  type="date"
                  value={dateTo || ''}
                  onChange={handleDateToChange}
                  min={dateFrom || undefined}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500'
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className={cn(
                'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500'
              )}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Location
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* District Filter */}
              <div>
                <label htmlFor="district-filter" className="block text-xs text-gray-600 mb-1">
                  District
                </label>
                <select
                  id="district-filter"
                  value={selectedDistrictId || ''}
                  onChange={handleDistrictChange}
                  disabled={loadingDistricts}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <option value="">
                    {loadingDistricts ? 'Loading...' : 'All districts'}
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name} ({district.postCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Neighborhood Filter */}
              <div>
                <label htmlFor="neighborhood-filter" className="block text-xs text-gray-600 mb-1">
                  Neighborhood
                </label>
                <select
                  id="neighborhood-filter"
                  value={selectedNeighborhoodId || ''}
                  onChange={handleNeighborhoodChange}
                  disabled={!selectedDistrictId || loadingNeighborhoods}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <option value="">
                    {!selectedDistrictId 
                      ? 'Select district first' 
                      : loadingNeighborhoods 
                      ? 'Loading...' 
                      : 'All neighborhoods'}
                  </option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name} ({neighborhood.postCount})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}