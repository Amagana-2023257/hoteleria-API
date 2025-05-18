// src/event/event.routes.js
import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from './event.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createEventValidator,
  updateEventValidator,
  getEventValidator
} from '../middlewares/event-validators.js';

const eventRouter = Router();

// ADMIN_SERVICE o ADMIN_HOTEL: gestionar eventos
eventRouter.post(
  '/eventos',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL'),
  createEventValidator,
  createEvent
);

eventRouter.put(
  '/eventos/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL'),
  updateEventValidator,
  updateEvent
);

eventRouter.delete(
  '/eventos/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL'),
  getEventValidator,
  deleteEvent
);

// Todos con sesión: listar y detalle de eventos
eventRouter.get(
  '/eventos',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getEvents
);

eventRouter.get(
  '/eventos/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getEventValidator,
  getEventById
);

export default eventRouter;
