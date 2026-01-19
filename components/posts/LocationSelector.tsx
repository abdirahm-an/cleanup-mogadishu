'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface District {
  id: string;
  name: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  districtId: string;
}

interface LocationSelectorProps {
  selectedDistrictId?: string;
  selectedNeighborhoodId?: string;
  onDistrictChange: (districtId: string) => void;
  onNeighborhoodChange: (neighborhoodId: string | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export default function LocationSelector({
  selectedDistrictId,
  selectedNeighborhoodId,
  onDistrictChange,
  onNeighborhoodChange,
  className,
  disabled = false,
}: LocationSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

  // Load districts on component mount
  useEffect(() => {
    async function loadDistricts() {
      try {
        setLoadingDistricts(true);
        const response = await fetch('/api/locations/districts');
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
    }

    loadDistricts();
  }, []);

  // Load neighborhoods when district changes
  useEffect(() => {
    async function loadNeighborhoods() {
      if (!selectedDistrictId) {
        setNeighborhoods([]);
        return;
      }

      try {
        setLoadingNeighborhoods(true);
        const response = await fetch(`/api/locations/neighborhoods?districtId=${selectedDistrictId}`);
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
    }

    loadNeighborhoods();
  }, [selectedDistrictId]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    onDistrictChange(districtId);
    // Reset neighborhood when district changes
    onNeighborhoodChange(undefined);
  };

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const neighborhoodId = e.target.value || undefined;
    onNeighborhoodChange(neighborhoodId);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* District Selector */}
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
          District *
        </label>
        <select
          id="district"
          value={selectedDistrictId || ''}
          onChange={handleDistrictChange}
          disabled={disabled || loadingDistricts}
          className={cn(
            'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selectedDistrictId && 'text-gray-500'
          )}
        >
          <option value="">
            {loadingDistricts ? 'Loading districts...' : 'Select a district'}
          </option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Neighborhood Selector */}
      <div>
        <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
          Neighborhood
        </label>
        <select
          id="neighborhood"
          value={selectedNeighborhoodId || ''}
          onChange={handleNeighborhoodChange}
          disabled={disabled || !selectedDistrictId || loadingNeighborhoods}
          className={cn(
            'flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selectedNeighborhoodId && 'text-gray-500'
          )}
        >
          <option value="">
            {!selectedDistrictId 
              ? 'Select a district first' 
              : loadingNeighborhoods 
              ? 'Loading neighborhoods...' 
              : 'Select a neighborhood (optional)'}
          </option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood.id} value={neighborhood.id}>
              {neighborhood.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}