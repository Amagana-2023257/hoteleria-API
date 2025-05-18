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
  getHotelValidator
} from '../middlewares/hotel-validators.js';
import { uploadHotelImages } from '../middlewares/multer-uploads.js';

const hotelRouter = Router();

// ADMIN_GLOBAL: crear + subir imágenes
hotelRouter.post(
  '/createHotel',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  uploadHotelImages,
  createHotelValidator,
  createHotel
);

// ADMIN_GLOBAL: actualizar + nuevas imágenes
hotelRouter.put(
  '/updateHotel/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  uploadHotelImages,
  updateHotelValidator,
  updateHotel
);

// ADMIN_GLOBAL: eliminar
hotelRouter.delete(
  '/deleteHotel/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  getHotelValidator,
  deleteHotel
);

// Cualquiera con sesión
hotelRouter.get(
  '/getHotels',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getHotels
);

hotelRouter.get(
  '/getHotel/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getHotelValidator,
  getHotelById
);

export default hotelRouter;
