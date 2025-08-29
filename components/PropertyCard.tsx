'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

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

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image Available
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={property.availability ? 'default' : 'secondary'}>
              {property.availability ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-blue-600 text-white">
              ${property.rent}/month
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.rooms} bed{property.rooms > 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
            </div>
            
            {property.area && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area} sq ft</span>
              </div>
            )}
          </div>
          
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}