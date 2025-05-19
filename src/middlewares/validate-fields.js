// src/middlewares/validate-fields.js
import { validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Mapear cada error a su mensaje
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    // Responder aquí mismo y cortar la cadena de middlewares
    return res.status(400).json({
      success: false,
      errors: extractedErrors
    });
  }
  // Si no hay errores, continúa
  next();
};
