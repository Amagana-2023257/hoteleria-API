// src/event/event.controller.js
import Event from './event.model.js';

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(500).json({ message: 'Event creation failed', error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('hotel');
    res.status(200).json({ message: 'Events retrieved', events });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('hotel');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event retrieved', event });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event', error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event updated', event });
  } catch (err) {
    res.status(500).json({ message: 'Event update failed', error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Event deletion failed', error: err.message });
  }
};
