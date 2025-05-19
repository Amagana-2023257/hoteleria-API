// src/hotel/hotel.routes.js
import { Router } from 'express';
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel
} from './hotel.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createHotelValidator,
  updateHotelValidator,
  getHotelValidator,
  deleteHotelValidator
} from '../middlewares/hotel-validators.js';
import { uploadHotelImages } from '../middlewares/multer-uploads.js';

const hotelRouter = Router();

// ADMIN_GLOBAL: crear + subir imágenes
hotelRouter.post(
  '/hoteles',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  uploadHotelImages,
  createHotelValidator,
  createHotel
);

// ADMIN_GLOBAL: actualizar + nuevas imágenes
hotelRouter.put(
  '/hoteles/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  uploadHotelImages,
  updateHotelValidator,
  updateHotel
);

// ADMIN_GLOBAL: eliminar
hotelRouter.delete(
  '/hoteles/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  deleteHotelValidator,
  deleteHotel
);

// Cualquiera con sesión: listar hoteles
hotelRouter.get(
  '/hoteles',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getHotels
);

// Cualquiera con sesión: detalle de hotel
hotelRouter.get(
  '/hoteles/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getHotelValidator,
  getHotelById
);


export default hotelRouter;
