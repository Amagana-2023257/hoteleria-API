import { body, param } from 'express-validator';
import { validarCampos } from '../middlewares/validate-fields.js';

export const createReservationValidator = [
  body('user').isMongoId().withMessage('Invalid user ID'),
  body('hotel').isMongoId().withMessage('Invalid hotel ID'),
  body('room').isMongoId().withMessage('Invalid room ID'),
  body('checkInDate').isISO8601().withMessage('Invalid check-in date'),
  body('checkOutDate').isISO8601().withMessage('Invalid check-out date'),
  validarCampos
];

export const updateReservationValidator = [
  body('status').optional().isIn(['Booked','CheckedIn','CheckedOut','Cancelled']).withMessage('Invalid status'),
  validarCampos
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID'), validarCampos];
