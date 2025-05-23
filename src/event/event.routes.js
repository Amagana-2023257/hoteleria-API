// src/routes/event.routes.js
import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../event/event.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createEventValidator,
  updateEventValidator,
  getEventValidator
} from '../middlewares/event-validators.js';

const eventRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: Endpoints para gestión de eventos
 */

/**
 * @swagger
 * /eventos:
 *   post:
 *     summary: Crear un nuevo evento para un hotel
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotel
 *               - name
 *               - startDate
 *               - endDate
 *             properties:
 *               hotel:
 *                 type: string
 *                 description: ObjectId del hotel
 *               name:
 *                 type: string
 *                 description: Nombre del evento
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Evento creado exitosamente.
 *       400:
 *         description: Error de validación o fechas inválidas.
 */
eventRouter.post(
  '/eventos',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL'),
  createEventValidator,
  createEvent
);

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Actualizar un evento existente
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente.
 *       400:
 *         description: Error de validación o fechas inválidas.
 *       404:
 *         description: Evento no encontrado.
 */
eventRouter.put(
  '/eventos/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL'),
  updateEventValidator,
  updateEvent
);

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado correctamente.
 *       404:
 *         description: Evento no encontrado.
 */
eventRouter.delete(
  '/eventos/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL'),
  getEventValidator,
  deleteEvent
);

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Listar todos los eventos
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida.
 */
eventRouter.get(
  '/eventos',
  getEvents
);

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Obtener un evento por su ID
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *       404:
 *         description: Evento no encontrado.
 */
eventRouter.get(
  '/eventos/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getEventValidator,
  getEventById
);

export default eventRouter;
