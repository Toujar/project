import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../middleware/withAuth.js';

export async function GET(request) {
  try {
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: authResult.user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}