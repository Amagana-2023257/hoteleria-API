import Reservation from './reservation.model.js';

export const createReservation = async (req, res) => {
  try {
    const resv = await Reservation.create(req.body);
    return res.status(201).json({ message: 'Reservation created', reservation: resv });
  } catch (e) {
    return res.status(500).json({ message: 'Error creating reservation', error: e.message });
  }
};

export const listReservations = async (req, res) => {
  try {
    const resvs = await Reservation.find()
      .populate('user', 'name surname email') // Solo lo necesario
      .populate('hotel', 'name')
      .populate('room', 'number');
    return res.json({ reservations: resvs });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching reservations', error: e.message });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const resv = await Reservation.findById(id)
      .populate('user', 'name surname email')
      .populate('hotel', 'name')
      .populate('room', 'number');
    if (!resv) return res.status(404).json({ message: 'Reservation not found' });
    return res.json({ reservation: resv });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching reservation', error: e.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const resv = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
    if (!resv) return res.status(404).json({ message: 'Reservation not found' });
    return res.json({ message: 'Reservation updated', reservation: resv });
  } catch (e) {
    return res.status(500).json({ message: 'Error updating reservation', error: e.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const resv = await Reservation.findByIdAndDelete(id);
    if (!resv) return res.status(404).json({ message: 'Reservation not found' });
    return res.json({ message: 'Reservation deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'Error deleting reservation', error: e.message });
  }
};
