// src/room/room.controller.js
import Room from './room.model.js';

export const createRoom = async (req, res) => {
  console.log('📦 createRoom payload:', req.body);      
  try {
    const room = await Room.create(req.body);
    return res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    console.error('❌ Room.create error:', err);      
    return res.status(500).json({ message: 'Room creation failed', error: err.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('hotel');
    res.status(200).json({ message: 'Rooms retrieved', rooms });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: err.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate('hotel');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room retrieved', room });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch room', error: err.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room updated', room });
  } catch (err) {
    res.status(500).json({ message: 'Room update failed', error: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Room deletion failed', error: err.message });
  }
};
export const getRoomsByHotel = async (req, res) => {
  const { hotelId } = req.params;
  console.log('📦 getRoomsByHotel hotelId:', hotelId);
  try {
    const rooms = await Room
      .find({ hotel: hotelId })
      .populate('hotel');
    return res.status(200).json({ message: 'Rooms by hotel retrieved', rooms });
  } catch (err) {
    console.error('❌ getRoomsByHotel error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to fetch rooms by hotel', error: err.message });
  }
};
