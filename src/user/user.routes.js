// src/routes/user.routes.js
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from './user.controller.js';
import {
  getUserValidator,
  getUserByIdValidator,
  updateUserValidator,
  deleteValidator
} from '../middlewares/user-validators.js';
// Importar multer middleware
import { uploadProfilePicture } from '../middlewares/multer-uploads.js';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios activos
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get(
  '/',
  getUserValidator,
  getUsers
);

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  '/:id',
  getUserByIdValidator,
  getUserById
);

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualiza datos de un usuario (excepto contraseña) y foto de perfil
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error de validación
 */
router.put(
  '/update/:id',
  uploadProfilePicture,           // middleware para subir foto
  updateUserValidator,
  updateUser
);

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Elimina (soft delete) un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  '/delete/:uid',
  deleteValidator,
  deleteUser
);

export default router;
