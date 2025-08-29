import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';
import Property from '../../../models/Property.js';
import { requireRole } from '../../../middleware/withAuth.js';
import { authenticateToken } from '../../../middleware/withAuth.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const minRent = searchParams.get('minRent');
    const maxRent = searchParams.get('maxRent');
    const rooms = searchParams.get('rooms');
    const ownerId = searchParams.get('ownerId');

    let query = {};
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = parseInt(minRent);
      if (maxRent) query.rent.$lte = parseInt(maxRent);
    }
    
    if (rooms) {
      query.rooms = parseInt(rooms);
    }
    
    // if (ownerId) {
    //   query.ownerId = ownerId;
    // } else {
    //   query.availability = true;
    // }
// if (ownerId) {
//   query.ownerId = ownerId;
// } else {
//   return res.status(400).json({ error: "Owner ID is required." });
// }
if (ownerId) {
  if (ownerId === "current") {
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }
    query.ownerId = authResult.user._id;
  } else {
    query.ownerId = ownerId;
  }
} else {
  query.availability = true; // only show public available listings if no ownerId
}

    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await requireRole(['owner'])(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    await connectDB();
    
    const propertyData = await request.json();
    const property = await Property.create({
      ...propertyData,
      ownerId: authResult.user._id,
    });

    const populatedProperty = await Property.findById(property._id)
      .populate('ownerId', 'name email phone');

    return NextResponse.json(
      { 
        message: 'Property created successfully',
        property: populatedProperty
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}