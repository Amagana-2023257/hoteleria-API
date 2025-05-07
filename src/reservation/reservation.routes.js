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
import { hasRoles }    from '../middlewares/validate-roles.js';
import {
  createReservationValidator,
  updateReservationValidator,
  idParamValidator
} from '../middlewares/reservation-validators.js';

const reservationRouter = Router();

// Creación por usuarios
reservationRouter.post(
  '/createReservation',
  validateJWT,
  hasRoles('USER_ROLE'),
  createReservationValidator,
  createReservation
);

// Listar y ver solo admins de plataforma o de hotel
reservationRouter.get(
  '/getReservations',
  validateJWT,
  hasRoles('ADMIN_GLOBAL', 'ADMIN_HOTEL'),
  listReservations
);
reservationRouter.get(
  '/getReservation/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL', 'ADMIN_HOTEL'),
  idParamValidator,
  getReservationById
);

// Actualizar por admins
reservationRouter.put(
  '/updateReservation/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL', 'ADMIN_HOTEL'),
  updateReservationValidator,
  updateReservation
);

// Borrar reservas (usuario puede cancelar la suya, admins también)
reservationRouter.delete(
  '/deleteReservation/:id',
  validateJWT,
  hasRoles('USER_ROLE', 'ADMIN_GLOBAL', 'ADMIN_HOTEL'),
  idParamValidator,
  deleteReservation
);

export default reservationRouter;
