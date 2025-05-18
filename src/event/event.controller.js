// src/event/event.controller.js
import Event from './event.model.js';

/**
 * Crear un nuevo evento
 */
export const createEvent = async (req, res) => {
  try {
    const {
      hotel,
      name,
      description = '',
      startDate,
      endDate,
      resources = []
    } = req.body;

    // Validación de fechas
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'La fecha de inicio debe ser anterior a la de fin' });
    }

    const event = await Event.create({
      hotel,
      name: name.trim(),
      description: description.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      resources
    });
    return res.status(201).json({ message: 'Evento creado', event });
  } catch (err) {
    console.error('Error al crear evento:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Listar todos los eventos
 */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('hotel', 'name location');
    return res.status(200).json({ message: 'Eventos obtenidos', events });
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Obtener evento por ID
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('hotel', 'name location');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    return res.status(200).json({ message: 'Evento obtenido', event });
  } catch (err) {
    console.error('Error al obtener evento:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Actualizar un evento
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.startDate && updates.endDate && new Date(updates.startDate) > new Date(updates.endDate)) {
      return res.status(400).json({ message: 'La fecha de inicio debe ser anterior a la de fin' });
    }

    const event = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('hotel', 'name location');

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    return res.status(200).json({ message: 'Evento actualizado', event });
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

/**
 * Eliminar un evento
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    return res.status(200).json({ message: 'Evento eliminado' });
  } catch (err) {
    console.error('Error al eliminar evento:', err);
    return res.status(500).json({ message: 'Error interno', error: err.message });
  }
};