// src/routes/hotel.routes.js
import { Router } from 'express';
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel
} from '../hotel/hotel.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoles } from '../middlewares/validate-roles.js';
import {
  createHotelValidator,
  updateHotelValidator,
  getHotelValidator,
  deleteHotelValidator
} from '../middlewares/hotel-validators.js';
import { uploadHotelImages } from '../middlewares/multer-uploads.js';

const hotelRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Hotel
 *   description: Endpoints para gestión de hoteles
 */

/**
 * @swagger
 * /hoteles:
 *   post:
 *     summary: Crear un nuevo hotel y subir imágenes
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - address
 *               - category
 *               - price
 *               - availableRooms
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Luxury, Standard, Economy]
 *               price:
 *                 type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               rating:
 *                 type: number
 *                 format: float
 *               availableRooms:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Hotel creado exitosamente.
 */
hotelRouter.post(
  '/hoteles',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  uploadHotelImages,
  createHotelValidator,
  createHotel
);

/**
 * @swagger
 * /hoteles/{id}:
 *   put:
 *     summary: Actualizar un hotel y añadir nuevas imágenes
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Luxury, Standard, Economy]
 *               price:
 *                 type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               rating:
 *                 type: number
 *                 format: float
 *               availableRooms:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Hotel actualizado correctamente.
 *       404:
 *         description: Hotel no encontrado.
 */
hotelRouter.put(
  '/hoteles/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  uploadHotelImages,
  updateHotelValidator,
  updateHotel
);

/**
 * @swagger
 * /hoteles/{id}:
 *   delete:
 *     summary: Eliminar un hotel
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel a eliminar
 *     responses:
 *       200:
 *         description: Hotel eliminado correctamente.
 *       404:
 *         description: Hotel no encontrado.
 */
hotelRouter.delete(
  '/hoteles/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL'),
  deleteHotelValidator,
  deleteHotel
);

/**
 * @swagger
 * /hoteles:
 *   get:
 *     summary: Listar todos los hoteles
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtrar por ubicación
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Luxury, Standard, Economy]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Calificación mínima
 *     responses:
 *       200:
 *         description: Lista de hoteles obtenida.
 */
hotelRouter.get(
  '/hoteles',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getHotels
);

/**
 * @swagger
 * /hoteles/{id}:
 *   get:
 *     summary: Obtener detalles de un hotel por ID
 *     tags: [Hotel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Detalles del hotel obtenidos.
 *       404:
 *         description: Hotel no encontrado.
 */
hotelRouter.get(
  '/hoteles/:id',
  validateJWT,
  hasRoles('ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'),
  getHotelValidator,
  getHotelById
);

export default hotelRouter;
