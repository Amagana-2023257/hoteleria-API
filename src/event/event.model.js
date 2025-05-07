// src/event/event.model.js
import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  hotel: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
},
  name: { 
    type: String, 
    required: true 
},
  description: { 
    type: String 
},
  startDate: { 
    type: Date, 
    required: true 
},
  endDate: { 
    type: Date, 
    required: true 
},
  resources: [{ type: String }]
}, { timestamps: true, versionKey: false });

export default model('Event', eventSchema);