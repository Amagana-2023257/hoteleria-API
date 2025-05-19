
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';
import { requireEmailOrUsername } from '../helpers/requireEmailOrUsername.js';

// Validación para obtener todos los usuarios (no params)
export const getUserValidator = [validarCampos];

// Validación para obtener un usuario por ID
export const getUserByIdValidator = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  validarCampos
];

// Validación para actualizar usuario
export const updateUserValidator = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  body('name')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 50 }).withMessage('El nombre no debe superar 50 caracteres'),
  body('surname')
    .optional()
    .isString().withMessage('El apellido debe ser texto')
    .isLength({ max: 50 }).withMessage('El apellido no debe superar 50 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Formato de email inválido'),
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Teléfono inválido'),
  body('role')
    .optional()
    .isIn(['ADMIN_GLOBAL','ADMIN_HOTEL','USER_ROLE','ADMIN_SERVICE'])
    .withMessage('Rol no válido'),
  validarCampos
];

// Validación para eliminar usuario (soft delete)
export const deleteValidator = [
  param('uid').isMongoId().withMessage('ID de usuario inválido'),
  validarCampos
];

// Validación para registrar usuario
export const registerValidator = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 50 }).withMessage('El nombre no debe superar 50 caracteres'),
  body('surname')
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ max: 50 }).withMessage('El apellido no debe superar 50 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Formato de email inválido'),
  body('username')
    .notEmpty().withMessage('El usuario es requerido'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Teléfono inválido'),
  body('role')
    .optional()
    .isIn(['ADMIN_GLOBAL','ADMIN_HOTEL','USER_ROLE','ADMIN_SERVICE'])
    .withMessage('Rol no válido'),
  requireEmailOrUsername().withMessage('Debe enviar email o username'),
  validarCampos
];

// Validación para login
export const loginValidator = [
  body('email')
    .optional()
    .isEmail().withMessage('Formato de email inválido'),
  body('username')
    .optional()
    .isString().withMessage('El usuario debe ser texto'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  requireEmailOrUsername().withMessage('Debe enviar email o username'),
  validarCampos
];

// Validación para solicitar reset password
export const requestPasswordResetValidator = [
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Formato de email inválido'),
  validarCampos
];

// Validación para reset password
export const resetPasswordValidator = [
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Formato de email inválido'),
  body('code')
    .notEmpty().withMessage('El código es requerido')
    .isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos'),
  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres'),
  validarCampos
];