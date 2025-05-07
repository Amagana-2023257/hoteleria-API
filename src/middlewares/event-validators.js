// src/middlewares/event-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createEventValidator = [
  body('hotel').isMongoId().withMessage('Invalid hotel ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  validarCampos
];

export const getEventValidator = [
  param('id').isMongoId().withMessage('Invalid event ID'),
  validarCampos
];

export const updateEventValidator = [
  param('id').isMongoId().withMessage('Invalid event ID'),
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('startDate').optional().isISO8601().withMessage('Invalid start date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  validarCampos
];

export const deleteEventValidator = [
  param('id').isMongoId().withMessage('Invalid event ID'),
  validarCampos
];
