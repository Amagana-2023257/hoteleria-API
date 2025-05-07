import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
  user:{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hotel:{ 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  room:{ 
    type: Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  checkInDate:{ 
    type: Date, 
    required: true 
  },
  checkOutDate:{ 
    type: Date, 
    required: true 
  },
  status:{ 
    type: String, 
    enum: ['Booked','CheckedIn','CheckedOut','Cancelled'], 
    default: 'Booked' }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Reservation', reservationSchema);