'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Home, CreditCard, FileText, Eye } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  location: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  images: string[];
}

interface Request {
  _id: string;
  propertyId: Property;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  moveInDate: string;
  createdAt: string;
}

interface Payment {
  _id: string;
  propertyId: { title: string; location: string };
  amount: number;
  status: string;
  paymentDate: string;
  month: string;
  year: number;
}

export default function TenantDashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, paymentsRes, propertiesRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/payments'),
        fetch('/api/properties?limit=6'),
      ]);

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData.requests || []);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.payments || []);
      }

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json();
        setRecentProperties(propertiesData.properties.slice(0, 6) || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const activeRequests = requests.filter(r => r.status !== 'rejected').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Dashboard</h1>
          <p className="text-gray-600">Find your perfect home and manage your rentals</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/properties">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Browse Properties</h3>
                <p className="text-gray-600 text-sm">Find available rental properties</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">My Requests</h3>
              <p className="text-gray-600 text-sm">{activeRequests} active requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Payment History</h3>
              <p className="text-gray-600 text-sm">${totalPayments.toLocaleString()} total paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{activeRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Rentals</p>
                  <p className="text-3xl font-bold text-gray-900">{approvedRequests}</p>
                </div>
                <Home className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-3xl font-bold text-gray-900">${totalPayments.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-4">
          <TabsList>
            <TabsTrigger value="properties">Recent Properties</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Properties</h2>
              <Link href="/properties">
                <Button>View All Properties</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <Badge className="absolute bottom-2 left-2 bg-blue-600">
                      ${property.rent}/month
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-2">{property.location}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {property.rooms} bed • {property.bathrooms} bath
                    </p>

                    <Link href={`/properties/${property._id}`}>
                      <Button className="w-full" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <h2 className="text-2xl font-bold">My Rental Requests</h2>

            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{request.propertyId.title}</h3>
                        <p className="text-gray-600 mb-2">{request.propertyId.location}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          Move-in Date: {new Date(request.moveInDate).toLocaleDateString()}
                        </p>
                        {request.message && (
                          <p className="text-sm text-gray-700 mb-2">
                            Message: "{request.message}"
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Requested: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
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
                        <p className="text-xl font-bold text-blue-600 mt-2">
                          ${request.propertyId.rent}/month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {requests.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No Requests Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Browse properties and send rental requests to get started.
                    </p>
                    <Link href="/properties">
                      <Button>Browse Properties</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
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

              {payments.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No Payments Yet</h3>
                    <p className="text-gray-600">
                      Your payment history will appear here once you start making rent payments.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}