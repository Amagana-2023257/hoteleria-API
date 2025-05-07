import Hotel from './hotel.model.js';

export const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ message: 'Hotel created', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Hotel creation failed', error: err.message });
  }
};

export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ message: 'Hotels retrieved', hotels });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hotels', error: err.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json({ message: 'Hotel retrieved', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hotel', error: err.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json({ message: 'Hotel updated', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Hotel update failed', error: err.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Hotel deletion failed', error: err.message });
  }
};