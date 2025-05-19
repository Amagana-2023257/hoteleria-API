// src/routes/room.routes.js
import { Router } from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByHotel
} from '../room/room.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createRoomValidator,
  updateRoomValidator,
  getRoomValidator,
  getRoomsByHotelValidator
} from '../middlewares/room-validators.js';

const roomRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: Endpoints para gestión de habitaciones
 */

/**
 * @swagger
 * /createRoom:
 *   post:
 *     summary: Crear una nueva habitación
 *     tags: [Room]
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
 *               - type
 *               - capacity
 *               - price
 *               - availabilityDate
 *             properties:
 *               hotel:
 *                 type: string
 *                 description: ObjectId del hotel al que pertenece
 *               type:
 *                 type: string
 *                 description: Tipo de habitación (e.g., Suite, Standard)
 *               description:
 *                 type: string
 *                 description: Descripción opcional de la habitación
 *               capacity:
 *                 type: integer
 *                 description: Número máximo de personas
 *               price:
 *                 type: number
 *                 description: Precio por noche
 *               availability:
 *                 type: string
 *                 enum: [available, not available]
 *                 description: Estado de disponibilidad
 *               availabilityDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha a partir de la cual la habitación está disponible
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente.
 */
roomRouter.post(
  '/createRoom',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  createRoomValidator,
  createRoom
);

/**
 * @swagger
 * /updateRoom/{id}:
 *   put:
 *     summary: Actualizar datos de una habitación
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la habitación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               availability:
 *                 type: string
 *                 enum: [available, not available]
 *               availabilityDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Habitación actualizada correctamente.
 *       404:
 *         description: Habitación no encontrada.
 */
roomRouter.put(
  '/updateRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  getRoomValidator,
  updateRoomValidator,
  updateRoom
);

/**
 * @swagger
 * /deleteRoom/{id}:
 *   delete:
 *     summary: Eliminar una habitación
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la habitación a eliminar
 *     responses:
 *       200:
 *         description: Habitación eliminada exitosamente.
 *       404:
 *         description: Habitación no encontrada.
 */
roomRouter.delete(
  '/deleteRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  getRoomValidator,
  deleteRoom
);

/**
 * @swagger
 * /getRooms:
 *   get:
 *     summary: Listar todas las habitaciones
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de habitaciones obtenida.
 */
roomRouter.get(
  '/getRooms',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRooms
);

/**
 * @swagger
 * /getRoom/{id}:
 *   get:
 *     summary: Obtener una habitación por su ID
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Habitación encontrada.
 *       404:
 *         description: Habitación no encontrada.
 */
roomRouter.get(
  '/getRoom/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRoomValidator,
  getRoomById
);

/**
 * @swagger
 * /getRoomsByHotel/{hotelId}:
 *   get:
 *     summary: Obtener habitaciones de un hotel específico
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Habitaciones del hotel obtenidas.
 */
roomRouter.get(
  '/getRoomsByHotel/:hotelId',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getRoomsByHotelValidator,
  getRoomsByHotel
);

export default roomRouter;
