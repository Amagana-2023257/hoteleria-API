import { Schema, model } from 'mongoose';

const hotelSchema = new Schema({
  name: { 
    type: String, 
    required: true 
},
  address: { 
    type: String, 
    required: true 
},
  category: { 
    type: String, 
    enum: ['Luxury', 'Standard', 'Economy'], 
    required: true },
  price: { 
    type: Number, 
    required: true 
},
  amenities: [
    { type: String }
]
}, {
  timestamps: true,
  versionKey: false,
});

export default model('Hotel', hotelSchema);