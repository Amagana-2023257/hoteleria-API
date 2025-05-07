import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createHotelValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('category').isIn(['Luxury', 'Standard', 'Economy']).withMessage('Invalid category'),
  body('price').isNumeric().withMessage('Price must be a number'),
  validarCampos
];

export const getHotelValidator = [
  param('id').isMongoId().withMessage('Invalid hotel ID'),
  validarCampos
];

export const updateHotelValidator = [
  param('id').isMongoId().withMessage('Invalid hotel ID'),
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('address').optional().notEmpty().withMessage('Address is required'),
  body('category').optional().isIn(['Luxury', 'Standard', 'Economy']).withMessage('Invalid category'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  validarCampos
];

export const deleteHotelValidator = [
  param('id').isMongoId().withMessage('Invalid hotel ID'),
  validarCampos
];