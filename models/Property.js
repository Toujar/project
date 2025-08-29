import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  rent: {
    type: Number,
    required: [true, 'Please provide rent amount'],
    min: [0, 'Rent cannot be negative'],
  },
  rooms: {
    type: Number,
    required: [true, 'Please specify number of rooms'],
    min: [1, 'Property must have at least 1 room'],
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: [1, 'Property must have at least 1 bathroom'],
  },
  area: {
    type: Number,
    min: [1, 'Area must be positive'],
  },
  images: [{
    type: String,
    required: true,
  }],
  availability: {
    type: Boolean,
    default: true,
  },
  amenities: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);