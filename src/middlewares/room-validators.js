// src/middlewares/room-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createRoomValidator = [
  body('hotel').isMongoId().withMessage('Invalid hotel ID'),
  body('type').notEmpty().withMessage('Type is required'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
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