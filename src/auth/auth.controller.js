// src/controllers/auth.controller.js
import { hash, verify } from 'argon2';
import crypto from 'crypto';
import path from 'path';
import User from '../user/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';
import { sendEmail } from '../helpers/send-email.js';

/**
 * Registrar un nuevo usuario (con profilePicture opcional)
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      phone,
      role
    } = req.body;
    // Hash de la contraseña
    const hashedPassword = await hash(password);

    // Procesar imagen de perfil si existe
    let profilePicture = null;
    if (req.file) {
      profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    }

    const user = await User.create({
      name: name.trim(),
      surname: surname.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim(),
      role,
      profilePicture
    });

    // Generar token
    const userDetails = user.toJSON();
    const token = await generateJWT(userDetails.id);

    return res.status(201).json({
      msg: 'Usuario registrado exitosamente',
      userDetails: { token, user: userDetails }
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: 'Error de validación', errors: messages });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({ msg: `El ${field} ya existe.` });
    }
    return res.status(500).json({ msg: 'Fallo en el registro', error: err.message });
  }
};

/**
 * Login de usuario
 */
export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user || !user.status) {
      return res.status(400).json({ msg: 'Credenciales inválidas o cuenta desactivada' });
    }

    const valid = await verify(user.password, password);
    if (!valid) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const userDetails = user.toJSON();
    const token = await generateJWT(userDetails.id);

    return res.status(200).json({
      msg: 'Login exitoso',
      userDetails: { token, user: userDetails }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Error de servidor al iniciar sesión', error: err.message });
  }
};

/**
 * Solicitar recuperación de contraseña
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email no registrado' });
    }

    // Generar código y expiración
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 3600 * 1000;

    user.passwordResetCode = resetCode;
    user.passwordResetExpires = new Date(expires);
    await user.save();

    // Enviar correo con el código
    await sendEmail({
      to: user.email,
      subject: 'Código para restablecer contraseña',
      text: `Tu código es: ${resetCode}`
    });

    return res.status(200).json({ msg: 'Código enviado al email' });
  } catch (err) {
    console.error('Request reset error:', err);
    return res.status(500).json({ msg: 'Error solicitando restablecimiento de contraseña' });
  }
};

/**
 * Restablecer contraseña utilizando código
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({
      email,
      passwordResetCode: code,
      passwordResetExpires: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }

    user.password = await hash(newPassword);
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({ msg: 'Contraseña restablecida correctamente' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ msg: 'Error restableciendo la contraseña' });
  }
};

/**
 * Crear un usuario por defecto para cada rol (ejecutar una sola vez)
 */
export const createDefaultUsers = async () => {
  const roles = [
    { key: 'ADMIN_GLOBAL', name: 'Super Admin Global', email: 'admin_global@correo.com' },
    { key: 'ADMIN_HOTEL', name: 'Super Admin Hotel', email: 'admin_hotel@correo.com' },
    { key: 'ADMIN_SERVICE', name: 'Super Admin Servicio', email: 'admin_service@correo.com' },
    { key: 'USER_ROLE', name: 'Usuario Default', email: 'user_default@correo.com' }
  ];

  for (const { key, name, email } of roles) {
    try {
      const exists = await User.exists({ role: key });
      if (exists) continue;
      const password = 'ChangeMe123!';
      const hashedPassword = await hash(password);
      const defaultUser = new User({
        name,
        surname: 'Default',
        username: key.toLowerCase(),
        email,
        password: hashedPassword,
        phone: '',
        role: key,
        status: true
      });
      await defaultUser.save();
      console.log(`Usuario por defecto creado: ${key}`);
    } catch (err) {
      console.error(`Error creando user default ${key}:`, err);
    }
  }
};

export default createDefaultUsers;
