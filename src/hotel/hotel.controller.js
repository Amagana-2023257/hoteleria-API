// src/controllers/hotel.controller.js
import Hotel from './hotel.model.js';

/**
 * Crear un nuevo hotel
 */
export const createHotel = async (req, res) => {
  try {
    const uploaded = req.files || [];
    const images = uploaded.map(file => `/uploads/hotels/${file.filename}`);

    const {
      name,
      location,
      address,
      category,
      price,
      amenities = [],
      rating = 0,
      availableRooms
    } = req.body;

    // Validación de campos obligatorios
    const missing = [];
    if (!name) missing.push('name');
    if (!location) missing.push('location');
    if (!address) missing.push('address');
    if (!category) missing.push('category');
    if (price == null) missing.push('price');
    if (availableRooms == null) missing.push('availableRooms');
    if (missing.length) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
        missingFields: missing
      });
    }

    const hotel = await Hotel.create({
      name: name.trim(),
      location: location.trim(),
      address: address.trim(),
      category,
      price: Number(price),
      amenities,
      images,
      rating: Number(rating),
      availableRooms: Number(availableRooms)
    });

    return res.status(201).json({ message: 'Hotel creado', hotel });
  } catch (err) {
    console.error('Hotel creation error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Fallo al crear hotel', error: err.message });
  }
};

/**
 * Obtener lista de hoteles con filtros opcionales
 */
export const getHotels = async (req, res) => {
  try {
    const { location, category, minPrice, maxPrice, minRating } = req.query;
    const filter = {};

    if (location) filter.location = new RegExp(location, 'i');
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const hotels = await Hotel.find(filter);
    return res.status(200).json({ message: 'Hoteles obtenidos', hotels });
  } catch (err) {
    console.error('Get hotels error:', err);
    return res.status(500).json({ message: 'Error al obtener hoteles', error: err.message });
  }
};

/**
 * Obtener un hotel por ID
 */
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }
    return res.status(200).json({ message: 'Hotel obtenido', hotel });
  } catch (err) {
    console.error('Get hotel by ID error:', err);
    return res.status(500).json({ message: 'Error al obtener hotel', error: err.message });
  }
};

/**
 * Actualizar datos de un hotel
 */
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const hotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }
    return res.status(200).json({ message: 'Hotel actualizado', hotel });
  } catch (err) {
    console.error('Update hotel error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    return res.status(500).json({ message: 'Error al actualizar hotel', error: err.message });
  }
};

/**
 * Eliminar un hotel
 */
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }
    return res.status(200).json({ message: 'Hotel eliminado' });
  } catch (err) {
    console.error('Delete hotel error:', err);
    return res.status(500).json({ message: 'Error al eliminar hotel', error: err.message });
  }
};
