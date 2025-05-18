// src/reservation/reservation.routes.js
import { Router } from 'express';
import {
  createReservation,
  listReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} from './reservation.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createReservationValidator,
  updateReservationValidator,
  idParamValidator
} from '../middlewares/reservation-validators.js';

const reservationRouter = Router();

// Usuarios generales: realizar una reservación
reservationRouter.post(
  '/reservaciones',
  validateJWT,
  hasRoles('USER_ROLE'),
  createReservationValidator,
  createReservation
);

// Administradores de plataforma y hotel: listar reservaciones
reservationRouter.get(
  '/reservaciones',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  listReservations
);

// Obtener reservación por ID
reservationRouter.get(
  '/reservaciones/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','USER_ROLE'),
  idParamValidator,
  getReservationById
);

// Administradores: actualizar reservación
reservationRouter.put(
  '/reservaciones/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  updateReservationValidator,
  updateReservation
);

// Usuarios y administradores: cancelar reservación
reservationRouter.delete(
  '/reservaciones/:id',
  validateJWT,
  hasRoles('USER_ROLE','ADMIN_GLOBAL','ADMIN_HOTEL'),
  idParamValidator,
  deleteReservation
);

export default reservationRouter;
