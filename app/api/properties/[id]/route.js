import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb.js';
import Property from '../../../../models/Property.js';
import { requireRole } from '../../../../middleware/withAuth.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const property = await Property.findById(params.id)
      .populate('ownerId', 'name email phone');

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    const updateData = await request.json();
    const property = await Property.findOneAndUpdate(
      { _id: params.id, ownerId: authResult.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email phone');

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireRole(['owner'])(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    await connectDB();
    
    const property = await Property.findOneAndDelete({
      _id: params.id,
      ownerId: authResult.user._id,
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}