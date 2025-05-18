// src/models/hotel.model.js
import { Schema, model } from 'mongoose';

const hotelSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  address: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    enum: ['Luxury', 'Standard', 'Economy'], 
    required: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  amenities: [
    { type: String, trim: true }
  ],
  images: [
    { type: String, trim: true }
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  availableRooms: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Hotel', hotelSchema);
