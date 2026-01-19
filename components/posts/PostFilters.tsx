'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
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
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedDistrictId = searchParams.get('district');
  const selectedNeighborhoodId = searchParams.get('neighborhood');
  const selectedStatus = searchParams.get('status');

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

  const clearFilters = () => {
    router.push('/posts');
  };

  const hasActiveFilters = selectedDistrictId || selectedNeighborhoodId || selectedStatus;

  const statusOptions = [
    { value: 'PUBLISHED', label: 'Open', color: 'bg-green-500', count: 0 },
    { value: 'UNDER_REVIEW', label: 'In Progress', color: 'bg-yellow-500', count: 0 },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-500', count: 0 },
  ];

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filter Posts</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Status Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Status
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusChange(null)}
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors',
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
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
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

        {/* Location Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* District Filter */}
          <div>
            <label htmlFor="district-filter" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label htmlFor="neighborhood-filter" className="block text-sm font-medium text-gray-700 mb-2">
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
  );
}