import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters'],
  },
  moveInDate: {
    type: Date,
    required: [true, 'Please provide preferred move-in date'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);