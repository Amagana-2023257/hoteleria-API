// src/room/room.routes.js
import { Router } from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} from './room.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles }    from '../middlewares/validate-roles.js';
import {
  createRoomValidator,
  updateRoomValidator,
 getRoomValidator
} from '../middlewares/room-validators.js';

const roomRouter = Router();

// Creación, edición y borrado por ADMIN_GLOBAL y ADMIN_HOTEL
roomRouter.post(
  '/createRoom',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  createRoomValidator,
  createRoom
);
roomRouter.put(
  '/updateRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  updateRoomValidator,
  updateRoom
);
roomRouter.delete(
  '/deleteRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  getRoomValidator,
  deleteRoom
);

// Todos con sesión pueden listar y ver
roomRouter.get(
  '/getRooms',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRooms
);
roomRouter.get(
  '/getRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRoomValidator,
  getRoomById
);

export default roomRouter;
