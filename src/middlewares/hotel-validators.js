// src/middlewares/hotel-validators.js
import { body, param } from 'express-validator';
import { validarCampos } from './validate-fields.js';

export const createHotelValidator = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('location')
    .notEmpty().withMessage('La ubicación es obligatoria'),
  body('address')
    .notEmpty().withMessage('La dirección es obligatoria'),
  body('category')
    .isIn(['Luxury','Standard','Economy']).withMessage('Categoría inválida'),
  body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número no negativo'),
  body('availableRooms')
    .notEmpty().withMessage('Rooms disponibles es obligatorio')
    .isInt({ min: 0 }).withMessage('Rooms disponibles debe ser entero no negativo'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Calificación debe estar entre 0 y 5'),
  body('amenities')
    .optional()
    .isArray().withMessage('Amenities debe ser un arreglo'),
  validarCampos
];

export const getHotelValidator = [
  param('id')
    .isMongoId().withMessage('ID de hotel inválido'),
  validarCampos
];

export const updateHotelValidator = [
  param('id')
    .isMongoId().withMessage('ID de hotel inválido'),
  body('name')
    .optional().notEmpty().withMessage('El nombre es obligatorio'),
  body('location')
    .optional().notEmpty().withMessage('La ubicación es obligatoria'),
  body('address')
    .optional().notEmpty().withMessage('La dirección es obligatoria'),
  body('category')
    .optional().isIn(['Luxury','Standard','Economy']).withMessage('Categoría inválida'),
  body('price')
    .optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número no negativo'),
  body('availableRooms')
    .optional().isInt({ min: 0 }).withMessage('Rooms disponibles debe ser entero no negativo'),
  body('rating')
    .optional().isFloat({ min: 0, max: 5 }).withMessage('Calificación debe estar entre 0 y 5'),
  body('amenities')
    .optional().isArray().withMessage('Amenities debe ser un arreglo'),
  validarCampos
];

export const deleteHotelValidator = [
  param('id')
    .isMongoId().withMessage('ID de hotel inválido'),
  validarCampos
];
