// src/room/room.controller.js
import Room from './room.model.js';

/**
 * Crear una nueva habitación
 */
export const createRoom = async (req, res) => {
  try {
    const {
      hotel,
      type,
      description = '',
      capacity,
      price,
      availability = 'available',
      availabilityDate,
    } = req.body;

    // Validación de campos obligatorios
    const missing = [];
    if (!hotel) missing.push('hotel');
    if (!type) missing.push('type');
    if (capacity == null) missing.push('capacity');
    if (price == null) missing.push('price');
    if (!availabilityDate) missing.push('availabilityDate');
    if (missing.length) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
        missingFields: missing,
      });
    }

    const room = await Room.create({
      hotel,
      type: type.trim(),
      description: description.trim(),
      capacity: Number(capacity),
      price: Number(price),
      availability,
      availabilityDate: new Date(availabilityDate),
    });

    return res.status(201).json({ message: 'Habitación creada', room });
  } catch (err) {
    console.error('Error al crear habitación:', err);
    if (err.name === 'ValidationError') {
      // Recolectar errores de validación de Mongoose
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Obtener todas las habitaciones
 */
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('hotel', 'name location');
    return res.status(200).json({ message: 'Habitaciones obtenidas', rooms });
  } catch (err) {
    console.error('Error al obtener habitaciones:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Obtener habitación por ID
 */
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate('hotel', 'name location');
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    return res.status(200).json({ message: 'Habitación obtenida', room });
  } catch (err) {
    console.error('Error al obtener habitación:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Actualizar datos de una habitación
 */
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const room = await Room.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('hotel', 'name location');

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    return res.status(200).json({ message: 'Habitación actualizada', room });
  } catch (err) {
    console.error('Error al actualizar habitación:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Eliminar una habitación
 */
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    return res.status(200).json({ message: 'Habitación eliminada' });
  } catch (err) {
    console.error('Error al eliminar habitación:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Obtener habitaciones por hotel
 */
export const getRoomsByHotel = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const rooms = await Room.find({ hotel: hotelId }).populate('hotel', 'name location');
    return res.status(200).json({ message: 'Habitaciones por hotel obtenidas', rooms });
  } catch (err) {
    console.error('Error al obtener habitaciones por hotel:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};