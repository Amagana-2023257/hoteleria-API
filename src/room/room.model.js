// src/models/room.model.js
import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  hotel: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: [true, 'El hotel es obligatorio']
  },
  type: { 
    type: String, 
    required: [true, 'El tipo de habitación es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  capacity: { 
    type: Number, 
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser al menos 1']
  },
  price: { 
    type: Number, 
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  availability: {
    type: String,
    enum: {
      values: ['available', 'not available'],
      message: 'Disponibilidad inválida'
    },
    default: 'available'
  },
  availabilityDate: {
    type: Date,
    required: [true, 'La fecha de disponibilidad es obligatoria']
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Room', roomSchema);
