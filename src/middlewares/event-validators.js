// src/middlewares/event-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createEventValidator = [
  body('hotel')
    .notEmpty().withMessage('El hotel es obligatorio')
    .isMongoId().withMessage('ID de hotel inválido'),
  body('name')
    .notEmpty().withMessage('El nombre del evento es obligatorio')
    .isString().withMessage('El nombre debe ser texto'),
  body('description')
    .optional().isString().withMessage('La descripción debe ser texto'),
  body('startDate')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().toDate().withMessage('Fecha de inicio inválida'),
  body('endDate')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().toDate().withMessage('Fecha de fin inválida'),
  body('resources')
    .optional().isArray().withMessage('Recursos debe ser un arreglo')
    .bail()
    .custom(arr => arr.every(item => typeof item === 'string')).withMessage('Todos los recursos deben ser texto'),
  validarCampos
];

export const getEventValidator = [
  param('id')
    .isMongoId().withMessage('ID de evento inválido'),
  validarCampos
];

export const updateEventValidator = [
  param('id')
    .isMongoId().withMessage('ID de evento inválido'),
  body('hotel')
    .optional().isMongoId().withMessage('ID de hotel inválido'),
  body('name')
    .optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('description')
    .optional().isString().withMessage('La descripción debe ser texto'),
  body('startDate')
    .optional().isISO8601().toDate().withMessage('Fecha de inicio inválida'),
  body('endDate')
    .optional().isISO8601().toDate().withMessage('Fecha de fin inválida'),
  body('resources')
    .optional().isArray().withMessage('Recursos debe ser un arreglo')
    .bail()
    .custom(arr => arr.every(item => typeof item === 'string')).withMessage('Todos los recursos deben ser texto'),
  validarCampos
];
