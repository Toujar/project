'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyModal from '@/components/PropertyModal';
import { Property } from '@/types/property';
import { Building, DollarSign, Users, AlertCircle, Plus, Edit, Trash2, Eye, Check, X } from 'lucide-react';

// interface Property {
//   _id: string;
//   title: string;
//   location: string;
//   rent: number;
//   rooms: number;
//   bathrooms: number;
//   area?: number;
//   description: string;
//   images: string[];
//   availability: boolean;
//   amenities: string[];
// }

interface Request {
  _id: string;
  propertyId: Property;
  tenantId: { name: string; email: string; phone: string };
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  moveInDate: string;
  createdAt: string;
}

interface Payment {
  _id: string;
  propertyId: { title: string; location: string };
  tenantId: { name: string; email: string };
  amount: number;
  status: string;
  paymentDate: string;
  month: string;
  year: number;
}

export default function OwnerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propertiesRes, requestsRes, paymentsRes] = await Promise.all([
        fetch('/api/properties?ownerId=current'),
        fetch('/api/requests'),
        fetch('/api/payments'),
      ]);

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json();
        setProperties(propertiesData.properties || []);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData.requests || []);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSaveProperty = async (propertyData: Property) => {
    setIsLoading(true);
    try {
      const url = editingProperty 
        ? `/api/properties/${editingProperty._id}` 
        : '/api/properties';
      const method = editingProperty ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        fetchData();
        setIsModalOpen(false);
        setEditingProperty(null);
      }
    } catch (error) {
      console.error('Failed to save property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleRequestUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  const totalRent = properties.reduce((sum, property) => sum + (property.availability ? 0 : property.rent), 0);
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Manage your properties and track rental performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${totalRent.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingRequests}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Payments</p>
                  <p className="text-3xl font-bold text-gray-900">{completedPayments}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-4">
          <TabsList>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="requests">Rental Requests</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Properties</h2>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property._id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    {property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                    <Badge
                      className={`absolute top-2 right-2 ${
                        property.availability ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {property.availability ? 'Available' : 'Rented'}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-2">{property.location}</p>
                    <p className="text-xl font-bold text-green-600 mb-4">
                      ${property.rent}/month
                    </p>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProperty(property);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProperty(property._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <h2 className="text-2xl font-bold">Rental Requests</h2>

            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{request.propertyId.title}</h3>
                        <p className="text-gray-600 mb-2">{request.propertyId.location}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          From: {request.tenantId.name} ({request.tenantId.email})
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Move-in Date: {new Date(request.moveInDate).toLocaleDateString()}
                        </p>
                        {request.message && (
                          <p className="text-sm text-gray-700 mb-4">
                            Message: "{request.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          className={`${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {request.status}
                        </Badge>

                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleRequestUpdate(request._id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRequestUpdate(request._id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <h2 className="text-2xl font-bold">Payment History</h2>

            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{payment.propertyId.title}</h3>
                        <p className="text-gray-600">{payment.propertyId.location}</p>
                        <p className="text-sm text-gray-500">
                          From: {payment.tenantId.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Period: {payment.month} {payment.year}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ${payment.amount.toLocaleString()}
                        </p>
                        <Badge
                          className={`mt-1 ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSaveProperty}
        property={editingProperty}
        isLoading={isLoading}
      />
    </div>
  );
}