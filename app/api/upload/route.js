import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';
import { requireRole } from '../../../middleware/withAuth.js';

export async function POST(request) {
  try {
    const authResult = await requireRole(['owner'])(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Convert buffer to base64
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      return await uploadToCloudinary(base64);
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Image upload failed' },
      { status: 500 }
    );
  }
}