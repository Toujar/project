import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';
import Request from '../../../models/Request.js';
import { authenticateToken } from '../../../middleware/withAuth.js';

export async function GET(request) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    
    if (authResult.user.role === 'owner') {
      query.ownerId = authResult.user._id;
    } else {
      query.tenantId = authResult.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate('propertyId', 'title location rent images')
      .populate('tenantId', 'name email phone')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    if (authResult.user.role !== 'tenant') {
      return NextResponse.json(
        { error: 'Only tenants can create rental requests' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const requestData = await request.json();
    
    // Check if request already exists
    const existingRequest = await Request.findOne({
      propertyId: requestData.propertyId,
      tenantId: authResult.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have an active request for this property' },
        { status: 400 }
      );
    }

    const rentalRequest = await Request.create({
      ...requestData,
      tenantId: authResult.user._id,
    });

    const populatedRequest = await Request.findById(rentalRequest._id)
      .populate('propertyId', 'title location rent images')
      .populate('tenantId', 'name email phone')
      .populate('ownerId', 'name email phone');

    return NextResponse.json(
      { 
        message: 'Rental request created successfully',
        request: populatedRequest
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}