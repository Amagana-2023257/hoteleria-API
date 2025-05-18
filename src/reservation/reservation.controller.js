// src/reservation/reservation.controller.js
import Reservation from './reservation.model.js';

/**
 * Crear una nueva reservación
 */
export const createReservation = async (req, res) => {
  try {
    const {
      user,
      hotel,
      room,
      checkInDate,
      checkOutDate,
      status = 'Booked'
    } = req.body;

    // Validar campos obligatorios
    const missing = [];
    if (!user) missing.push('user');
    if (!hotel) missing.push('hotel');
    if (!room) missing.push('room');
    if (!checkInDate) missing.push('checkInDate');
    if (!checkOutDate) missing.push('checkOutDate');
    if (missing.length) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
        missingFields: missing
      });
    }

    // Validar fechas
    if (new Date(checkInDate) > new Date(checkOutDate)) {
      return res.status(400).json({ message: 'La fecha de check-in debe ser anterior a la de check-out' });
    }

    const reservation = await Reservation.create({
      user,
      hotel,
      room,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      status
    });

    return res.status(201).json({ message: 'Reservación creada', reservation });
  } catch (err) {
    console.error('Error al crear reservación:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Listar todas las reservaciones (solo para administradores)
 */
export const listReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name surname email')
      .populate('hotel', 'name')
      .populate('room', 'number');
    return res.status(200).json({ message: 'Reservaciones obtenidas', reservations });
  } catch (err) {
    console.error('Error al obtener reservaciones:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Obtener reservación por ID
 */
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id)
      .populate('user', 'name surname email')
      .populate('hotel', 'name')
      .populate('room', 'number');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    return res.status(200).json({ message: 'Reservación obtenida', reservation });
  } catch (err) {
    console.error('Error al obtener reservación:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Actualizar reservación
 */
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.checkInDate && updates.checkOutDate && new Date(updates.checkInDate) > new Date(updates.checkOutDate)) {
      return res.status(400).json({ message: 'La fecha de check-in debe ser anterior a la de check-out' });
    }

    const reservation = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })
      .populate('user', 'name surname email')
      .populate('hotel', 'name')
      .populate('room', 'number');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    return res.status(200).json({ message: 'Reservación actualizada', reservation });
  } catch (err) {
    console.error('Error al actualizar reservación:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Eliminar (cancelar) reservación
 */
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    return res.status(200).json({ message: 'Reservación cancelada' });
  } catch (err) {
    console.error('Error al cancelar reservación:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};
