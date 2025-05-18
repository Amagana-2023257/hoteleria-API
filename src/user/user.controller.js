// src/controllers/user.controller.js
import path from 'path';
import User from './user.model.js';

/**
 * Obtener todos los usuarios activos
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ status: true });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ success: false, message: 'Error obteniendo usuarios' });
  }
};

/**
 * Obtener un usuario por ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || !user.status) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Get user by ID error:', err);
    return res.status(500).json({ success: false, message: 'Error obteniendo el usuario' });
  }
};

/**
 * Actualizar datos de un usuario
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    // Prohibir actualización de campos sensibles
    delete updates.password;
    delete updates.passwordResetCode;
    delete updates.passwordResetExpires;

    // Si se sube una nueva imagen de perfil
    if (req.file) {
      // req.file.filename proviene de multer-uploads middleware
      updates.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Update user error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({ success: false, message: `El ${field} ya existe.` });
    }
    return res.status(500).json({ success: false, message: 'Error actualizando el usuario' });
  }
};

/**
 * Eliminar (desactivar) un usuario
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Usuario eliminado', user });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, message: 'Error eliminando el usuario' });
  }
};
