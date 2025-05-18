import { hash, verify } from 'argon2';
import User from './user.model.js';


// get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ status: true });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error obteniendo usuarios' });
  }
};

// Obtener user por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error obteniendo el usuario' });
  }
};

// update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    // Prohibir actualización de contraseña desde este endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
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


// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Usuario eliminado', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error eliminando el usuario' });
  }
};
