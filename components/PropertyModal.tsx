'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Upload } from 'lucide-react';

interface Property {
  _id?: string;
  title: string;
  location: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  area?: number;
  description: string;
  images: string[];
  availability: boolean;
  amenities: string[];
}

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
  property?: Property | null;
  isLoading?: boolean;
}

export default function PropertyModal({ isOpen, onClose, onSave, property, isLoading }: PropertyModalProps) {
  const [formData, setFormData] = useState<Property>({
    title: property?.title || '',
    location: property?.location || '',
    rent: property?.rent || 0,
    rooms: property?.rooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    description: property?.description || '',
    images: property?.images || [],
    availability: property?.availability ?? true,
    amenities: property?.amenities || [],
  });
  
  const [newAmenity, setNewAmenity] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploadingImages(true);
    const uploadFormData = new FormData();
    
    Array.from(files).forEach(file => {
      uploadFormData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const { imageUrls } = await response.json();
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls]
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Edit Property' : 'Add New Property'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent ($)</Label>
              <Input
                id="rent"
                type="number"
                value={formData.rent}
                onChange={(e) => handleInputChange('rent', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rooms">Bedrooms</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => handleInputChange('rooms', parseInt(e.target.value) || 1)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 1)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ''}
                onChange={(e) => handleInputChange('area', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                </span>
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex space-x-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={formData.availability}
              onCheckedChange={(checked) => handleInputChange('availability', checked)}
            />
            <Label htmlFor="availability">Available for rent</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || uploadingImages}>
              {isLoading ? 'Saving...' : 'Save Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}