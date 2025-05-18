// src/room/room.routes.js
import { Router } from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByHotel
} from './room.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createRoomValidator,
  updateRoomValidator,
  getRoomValidator,
  getRoomsByHotelValidator
} from '../middlewares/room-validators.js';

const roomRouter = Router();

// ADMIN_GLOBAL: crear habitación
roomRouter.post(
  '/createRoom',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  createRoomValidator,
  createRoom
);

// ADMIN_GLOBAL: actualizar habitación
roomRouter.put(
  '/updateRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  getRoomValidator,
  updateRoomValidator,
  updateRoom
);

// ADMIN_GLOBAL: eliminar habitación
roomRouter.delete(
  '/deleteRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  getRoomValidator,
  deleteRoom
);

// Cualquiera con sesión: listar todas las habitaciones
roomRouter.get(
  '/getRooms',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRooms
);

// Cualquiera con sesión: obtener habitación por ID
roomRouter.get(
  '/getRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRoomValidator,
  getRoomById
);

// Cualquiera con sesión: obtener habitaciones por hotel
roomRouter.get(
  '/getRoomsByHotel/:hotelId',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRoomsByHotelValidator,
  getRoomsByHotel
);

export default roomRouter;