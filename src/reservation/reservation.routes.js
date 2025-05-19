// src/routes/reservation.routes.js
import { Router } from 'express';
import {
  createReservation,
  listReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} from '../reservation/reservation.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createReservationValidator,
  updateReservationValidator,
  idParamValidator
} from '../middlewares/reservation-validators.js';

const reservationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reservation
 *   description: Endpoints para gestión de reservaciones
 */

/**
 * @swagger
 * /reservaciones:
 *   post:
 *     summary: Crear una nueva reservación (Usuario)
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - hotel
 *               - room
 *               - checkInDate
 *               - checkOutDate
 *             properties:
 *               user:
 *                 type: string
 *                 description: ObjectId del usuario
 *               hotel:
 *                 type: string
 *                 description: ObjectId del hotel
 *               room:
 *                 type: string
 *                 description: ObjectId de la habitación
 *               checkInDate:
 *                 type: string
 *                 format: date-time
 *               checkOutDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [Booked, CheckedIn, CheckedOut, Cancelled]
 *                 default: Booked
 *     responses:
 *       201:
 *         description: Reservación creada correctamente.
 *       400:
 *         description: Faltan campos obligatorios o error de validación.
 */
reservationRouter.post(
  '/reservaciones',
  validateJWT,
  hasRoles('USER_ROLE'),
  createReservationValidator,
  createReservation
);

/**
 * @swagger
 * /reservaciones:
 *   get:
 *     summary: Listar todas las reservaciones (Admin)
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida.
 *       403:
 *         description: No autorizado.
 */
reservationRouter.get(
  '/reservaciones',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  listReservations
);

/**
 * @swagger
 * /reservaciones/{id}:
 *   get:
 *     summary: Obtener reservación por ID
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación encontrada.
 *       404:
 *         description: Reservación no encontrada.
 */
reservationRouter.get(
  '/reservaciones/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','USER_ROLE'),
  idParamValidator,
  getReservationById
);

/**
 * @swagger
 * /reservaciones/{id}:
 *   put:
 *     summary: Actualizar reservación (Admin)
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkInDate:
 *                 type: string
 *                 format: date-time
 *               checkOutDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [Booked, CheckedIn, CheckedOut, Cancelled]
 *     responses:
 *       200:
 *         description: Reservación actualizada correctamente.
 *       400:
 *         description: Error de validación.
 *       404:
 *         description: Reservación no encontrada.
 */
reservationRouter.put(
  '/reservaciones/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL'),
  updateReservationValidator,
  updateReservation
);

/**
 * @swagger
 * /reservaciones/{id}:
 *   delete:
 *     summary: Cancelar reservación (Usuario/Admin)
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación a cancelar
 *     responses:
 *       200:
 *         description: Reservación cancelada correctamente.
 *       404:
 *         description: Reservación no encontrada.
 */
reservationRouter.delete(
  '/reservaciones/:id',
  validateJWT,
  hasRoles('USER_ROLE','ADMIN_GLOBAL','ADMIN_HOTEL'),
  idParamValidator,
  deleteReservation
);

export default reservationRouter;
