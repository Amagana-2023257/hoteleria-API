// src/room/room.model.js
import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  hotel: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
},
  type: { 
    type: String, 
    required: true 
},
  capacity: { 
    type: Number, 
    required: true 
},
  price: { 
    type: Number, 
    required: true 
},
  availability: [{ type: Date }]
  
}, { timestamps: true, versionKey: false });

export default model('Room', roomSchema);
