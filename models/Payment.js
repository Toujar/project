import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: [0, 'Amount cannot be negative'],
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);