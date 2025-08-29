import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../lib/mongodb.js';
import Payment from '../../../models/Payment.js';
import { authenticateToken } from '../../../middleware/withAuth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        { error: 'Only tenants can make payments' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { propertyId, ownerId, amount, month, year } = await request.json();

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        tenantId: authResult.user._id.toString(),
        propertyId,
        month,
        year: year.toString(),
      },
    });

    // Create payment record
    const payment = await Payment.create({
      tenantId: authResult.user._id,
      propertyId,
      ownerId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      month,
      year,
      dueDate: new Date(year, month - 1, 1), // First day of the month
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      payment
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Payment creation failed' },
      { status: 500 }
    );
  }
}

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
    
    let query = {};
    
    if (authResult.user.role === 'tenant') {
      query.tenantId = authResult.user._id;
    } else {
      query.ownerId = authResult.user._id;
    }

    const payments = await Payment.find(query)
      .populate('propertyId', 'title location')
      .populate('tenantId', 'name email')
      .sort({ paymentDate: -1 });

    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}