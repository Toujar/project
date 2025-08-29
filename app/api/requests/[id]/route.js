import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb.js';
import Request from '../../../../models/Request.js';
import Property from '../../../../models/Property.js';
import { requireRole } from '../../../../middleware/withAuth.js';

export async function PUT(request, { params }) {
  try {
    const authResult = await requireRole(['owner'])(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { status } = await request.json();
    
    const rentalRequest = await Request.findOneAndUpdate(
      { _id: params.id, ownerId: authResult.user._id },
      { 
        status, 
        respondedAt: new Date()
      },
      { new: true }
    ).populate('propertyId tenantId ownerId');

    if (!rentalRequest) {
      return NextResponse.json(
        { error: 'Request not found or unauthorized' },
        { status: 404 }
      );
    }

    // If approved, mark property as unavailable
    if (status === 'approved') {
      await Property.findByIdAndUpdate(
        rentalRequest.propertyId._id,
        { availability: false }
      );
    }

    return NextResponse.json({
      message: 'Request updated successfully',
      request: rentalRequest
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}