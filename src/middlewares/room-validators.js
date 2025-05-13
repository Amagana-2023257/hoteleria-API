// src/middlewares/room-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createRoomValidator = [
  body('hotel')
    .isMongoId().withMessage('ID de hotel inválido'),
  body('type')
    .notEmpty().withMessage('El tipo de habitación es requerido'),
  body('capacity')
    .isInt({ gt: 0 }).withMessage('La capacidad debe ser un número entero mayor que 0'),
  body('price')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0'),
  validarCampos
];

export const getRoomValidator = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  validarCampos
];

export const updateRoomValidator = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('type').optional().notEmpty().withMessage('Type is required'),
  body('capacity').optional().isNumeric().withMessage('Capacity must be a number'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  validarCampos
];

export const deleteRoomValidator = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  validarCampos
];

export const getRoomsByHotelValidator = [
  param('hotelId')
    .isMongoId().withMessage('ID de hotel inválido'),
  validarCampos
];