import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../../../lib/mongodb.js';
import Payment from '../../../../models/Payment.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      await connectDB();
      
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'completed' }
      );
    } catch (error) {
      console.error('Database update failed:', error);
    }
  }

  return NextResponse.json({ received: true });
}