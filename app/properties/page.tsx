'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import PropertyCard from '@/components/PropertyCard';
import { Search, Filter } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  location: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  area?: number;
  images: string[];
  availability: boolean;
  amenities?: string[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minRent: '',
    maxRent: '',
    rooms: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        property =>
          property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          property.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Rent range filter
    if (filters.minRent) {
      filtered = filtered.filter(property => property.rent >= parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(property => property.rent <= parseInt(filters.maxRent));
    }

    // Rooms filter
    if (filters.rooms) {
      filtered = filtered.filter(property => property.rooms === parseInt(filters.rooms));
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minRent: '',
      maxRent: '',
      rooms: '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Properties</h1>
          <p className="text-gray-600">Find your perfect rental home</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search properties or locations..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="minRent">Min Rent ($)</Label>
                    <Input
                      id="minRent"
                      type="number"
                      placeholder="0"
                      value={filters.minRent}
                      onChange={(e) => handleFilterChange('minRent', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxRent">Max Rent ($)</Label>
                    <Input
                      id="maxRent"
                      type="number"
                      placeholder="No limit"
                      value={filters.maxRent}
                      onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Bedrooms</Label>
                    <Select value={filters.rooms} onValueChange={(value) => handleFilterChange('rooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or clearing filters.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}