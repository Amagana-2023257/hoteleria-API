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
import { hasRoles }    from '../middlewares/validate-roles.js';
import {
  createHotelValidator,
  updateHotelValidator,
getHotelValidator
} from '../middlewares/hotel-validators.js';

const hotelRouter = Router();

// Creación, actualización y eliminación solo ADMIN_GLOBAL
hotelRouter.post(
  '/createHotel',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  createHotelValidator,
  createHotel
);
hotelRouter.put(
  '/updateHotel/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  updateHotelValidator,
  updateHotel
);
hotelRouter.delete(
  '/deleteHotel/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  getHotelValidator,
  deleteHotel
);

// Cualquiera con sesión (usuarios y admins) puede listar y ver
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
