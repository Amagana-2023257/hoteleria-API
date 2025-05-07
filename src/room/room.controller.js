// src/room/room.controller.js
import Room from './room.model.js';

export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    res.status(500).json({ message: 'Room creation failed', error: err.message });
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
