// src/middlewares/reservation-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createReservationValidator = [
  body('user')
    .notEmpty().withMessage('El usuario es obligatorio')
    .isMongoId().withMessage('ID de usuario inválido'),
  body('hotel')
    .notEmpty().withMessage('El hotel es obligatorio')
    .isMongoId().withMessage('ID de hotel inválido'),
  body('room')
    .notEmpty().withMessage('La habitación es obligatoria')
    .isMongoId().withMessage('ID de habitación inválido'),
  body('checkInDate')
    .notEmpty().withMessage('La fecha de check-in es obligatoria')
    .isISO8601().toDate().withMessage('Fecha de check-in inválida'),
  body('checkOutDate')
    .notEmpty().withMessage('La fecha de check-out es obligatoria')
    .isISO8601().toDate().withMessage('Fecha de check-out inválida'),
  body('status')
    .optional()
    .isIn(['Booked','CheckedIn','CheckedOut','Cancelled']).withMessage('Status inválido'),
  validarCampos
];

export const updateReservationValidator = [
  param('id')
    .isMongoId().withMessage('ID de reservación inválido'),
  body('checkInDate')
    .optional().isISO8601().toDate().withMessage('Fecha de check-in inválida'),
  body('checkOutDate')
    .optional().isISO8601().toDate().withMessage('Fecha de check-out inválida'),
  body('status')
    .optional()
    .isIn(['Booked','CheckedIn','CheckedOut','Cancelled']).withMessage('Status inválido'),
  validarCampos
];

export const idParamValidator = [
  param('id')
    .isMongoId().withMessage('ID de reservación inválido'),
  validarCampos
];
