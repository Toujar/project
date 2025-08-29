'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Bed, Bath, Square, Calendar, User, Phone, Mail, ArrowLeft, Send } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  area?: number;
  images: string[];
  availability: boolean;
  amenities?: string[];
  ownerId: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({
    message: '',
    moveInDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchProperty();
  }, [params.id]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data.property);
      } else {
        router.push('/properties');
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
      router.push('/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          propertyId: property?._id,
          ownerId: property?.ownerId,
          message: requestForm.message,
          moveInDate: requestForm.moveInDate,
        }),
      });

      if (response.ok) {
        setShowRequestModal(false);
        setRequestForm({ message: '', moveInDate: '' });
        alert('Rental request sent successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send request');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Button onClick={() => router.push('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                {property.images && property.images.length > 0 ? (
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev === 0 ? property.images.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          &#8249;
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev === property.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          &#8250;
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <Badge className={property.availability ? 'bg-green-600' : 'bg-red-600'}>
                    {property.availability ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{property.location}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{property.rooms}</p>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{property.bathrooms}</p>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                  
                  {property.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Square className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="font-semibold">{property.area}</p>
                      <p className="text-sm text-gray-600">Sq Ft</p>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">${property.rent}</p>
                    <p className="text-sm text-gray-600">Per Month</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact and Actions */}
          <div className="space-y-6">
            {/* Property Owner */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property Owner</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{property.ownerId.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-sm">{property.ownerId.email}</span>
                  </div>
                  
                  {property.ownerId.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">{property.ownerId.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Interested?</h3>
                
                {user && user.role === 'tenant' && property.availability ? (
                  <Button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full mb-4"
                    size="lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Rental Request
                  </Button>
                ) : !user ? (
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push('/auth/login')}
                      className="w-full"
                      size="lg"
                    >
                      Login to Send Request
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      Don't have an account?{' '}
                      <button
                        onClick={() => router.push('/auth/signup?role=tenant')}
                        className="text-blue-600 hover:underline"
                      >
                        Sign up as tenant
                      </button>
                    </p>
                  </div>
                ) : user.role === 'owner' ? (
                  <p className="text-center text-gray-600">
                    Property owners cannot send rental requests.
                  </p>
                ) : (
                  <p className="text-center text-gray-600">
                    This property is currently unavailable.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rental Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Rental Request</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
              <Input
                id="moveInDate"
                type="date"
                value={requestForm.moveInDate}
                onChange={(e) => setRequestForm(prev => ({ ...prev, moveInDate: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell the owner why you're interested in this property..."
                value={requestForm.message}
                onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}