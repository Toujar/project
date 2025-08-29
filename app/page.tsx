'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Users, CreditCard, Shield, Search, Building } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simplify Your 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Rental Management</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Complete property management solution for owners and tenants. Manage properties, handle requests, and process payments seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/properties">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Rentals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline property management for both owners and tenants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Property Management</h3>
                <p className="text-gray-600">
                  Easily add, edit, and manage your rental properties with detailed descriptions and photo galleries.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Search</h3>
                <p className="text-gray-600">
                  Advanced filtering system to help tenants find the perfect property based on location, price, and amenities.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Request Management</h3>
                <p className="text-gray-600">
                  Streamlined system for handling rental requests with approval workflows and communication tools.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Payments</h3>
                <p className="text-gray-600">
                  Integrated Stripe payment processing for secure online rent collection and payment tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Role-Based Access</h3>
                <p className="text-gray-600">
                  Secure authentication system with separate dashboards and permissions for owners and tenants.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Comprehensive Dashboard</h3>
                <p className="text-gray-600">
                  Real-time analytics and insights with visual charts showing property performance and payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Rental Business?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of property owners and tenants who trust RentManager for their rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?role=owner">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold px-8">
                I'm a Property Owner
              </Button>
            </Link>
            <Link href="/auth/signup?role=tenant">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8">
                I'm Looking for a Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}