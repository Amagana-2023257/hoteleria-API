// src/middlewares/room-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

// Validación para crear habitación
export const createRoomValidator = [
  body('hotel')
    .notEmpty().withMessage('El hotel es obligatorio').bail()
    .isMongoId().withMessage('ID de hotel inválido'),
  
  body('type')
    .notEmpty().withMessage('El tipo de habitación es obligatorio').bail()
    .isString().withMessage('El tipo debe ser texto'),
  
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  
  body('capacity')
    .notEmpty().withMessage('La capacidad es obligatoria').bail()
    .isInt({ min: 1 }).withMessage('La capacidad debe ser al menos 1'),
  
  body('price')
    .notEmpty().withMessage('El precio es obligatorio').bail()
    .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
  
  body('availability')
    .optional()
    .isIn(['available','not available']).withMessage('Disponibilidad inválida'),
  
  body('availabilityDate')
    .notEmpty().withMessage('La fecha de disponibilidad es obligatoria').bail()
    .isISO8601().withMessage('Fecha de disponibilidad inválida').bail()
    .toDate(),
  
  validarCampos
];

// Validación para obtener habitación por ID
export const getRoomValidator = [
  param('id')
    .isMongoId().withMessage('ID de habitación inválido'),
  validarCampos
];

// Validación para actualizar habitación
export const updateRoomValidator = [
  param('id')
    .isMongoId().withMessage('ID de habitación inválido'),
  body('hotel')
    .optional()
    .isMongoId().withMessage('ID de hotel inválido'),
  body('type')
    .optional()
    .isString().withMessage('El tipo debe ser texto'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('La capacidad debe ser al menos 1'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
  body('availability')
    .optional()
    .isIn(['available','not available']).withMessage('Disponibilidad inválida'),
  body('availabilityDate')
    .optional()
    .isISO8601().toDate().withMessage('Fecha de disponibilidad inválida'),
  validarCampos
];

// Validación para obtener habitaciones por hotel
export const getRoomsByHotelValidator = [
  param('hotelId')
    .isMongoId().withMessage('ID de hotel inválido'),
  validarCampos
];