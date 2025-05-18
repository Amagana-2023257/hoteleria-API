import { Router } from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from './user.controller.js'
import {
  getUserValidator,
  getUserByIdValidator,
  updateUserValidator,
  deleteValidator
} from '../middlewares/user-validators.js'

const router = Router()

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
)

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
  '/:uid',
  getUserByIdValidator,
  getUserById
)

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualiza datos de un usuario (excepto contraseña)
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error de validación
 */
router.put(
  '/update/:uid',
  updateUserValidator,
  updateUser
)

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
)

export default router
