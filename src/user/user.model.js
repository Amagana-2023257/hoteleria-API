// src/models/user.model.js
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    maxlength: [50, 'El nombre no debe superar 50 caracteres']
  },
  surname: {
    type: String,
    required: [true, 'El apellido es requerido'],
    maxlength: [50, 'El apellido no debe superar 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, 'El usuario es requerido'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ["ADMIN_GLOBAL", "ADMIN_HOTEL", "USER_ROLE", "ADMIN_SERVICE"],
    default: 'USER_ROLE'
  },
  status: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: null
  }
}, {
  versionKey: false,
  timestamps: true
});

userSchema.methods.toJSON = function() {
  const { _id, __v, password, ...user } = this.toObject();
  user.id = _id;
  return user;
};

export default model('User', userSchema);
