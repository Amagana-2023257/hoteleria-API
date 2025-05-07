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
import { hasRoles }    from '../middlewares/validate-roles.js';
import {
  createEventValidator,
  updateEventValidator,
   getEventValidator
} from '../middlewares/event-validators.js';

const eventRouter = Router();

// Solo ADMIN_SERVICE y ADMIN_HOTEL pueden gestionar eventos
eventRouter.post(
  '/createEvent',
  validateJWT,
  hasRoles('ADMIN_SERVICE','ADMIN_HOTEL'),
  createEventValidator,
  createEvent
);
eventRouter.put(
  '/updateEvent/:id',
  validateJWT,
  hasRoles('ADMIN_SERVICE','ADMIN_HOTEL'),
  updateEventValidator,
  updateEvent
);
eventRouter.delete(
  '/deleteEvent/:id',
  validateJWT,
  hasRoles('ADMIN_SERVICE','ADMIN_HOTEL'),
  getEventValidator,
  deleteEvent
);

// Todos con sesión pueden listar y ver
eventRouter.get(
  '/getEvents',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getEvents
);
eventRouter.get(
  '/getEvent/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getEventValidator,
  getEventById
);

export default eventRouter;
