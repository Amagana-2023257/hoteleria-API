// src/middlewares/requireEmailOrUsername.js
import { body } from 'express-validator';

/**
 * Valida que se envíe al menos email o username en el body
 */
export const requireEmailOrUsername = () =>
  body().custom((_, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error('Debe enviar email o username');
    }
    return true;
  });
