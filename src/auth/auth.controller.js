// src/auth/auth.controller.js
import { hash, verify } from 'argon2';
import User from '../user/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const register = async (req, res) => {
  try {
    const { name, surname, username, email, password, phone } = req.body;
    const profilePicture = req.file?.filename ?? null;

    // Encriptar la contraseña
    const hashedPassword = await hash(password);

    // Crear usuario
    const user = await User.create({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      phone,
      profilePicture
    });

    // Preparar datos a devolver (usa el método toJSON del esquema)
    const userDetails = user.toJSON();
    const token = await generateJWT(userDetails.id);

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      userDetails: { token, user: userDetails }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      msg: "User registration failed",
      error: err.message
    });
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Buscar usuario por email o username
    const user = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (!user) {
      return res.status(400).json({
        msg: "Credenciales inválidas",
        error: "No existe el usuario o correo ingresado"
      });
    }

    // Verificar estado activo
    if (!user.status) {
      return res.status(403).json({
        msg: "Cuenta desactivada",
        error: "Contacta al administrador"
      });
    }

    // Validar contraseña
    const valid = await verify(user.password, password);
    if (!valid) {
      return res.status(400).json({
        msg: "Credenciales inválidas",
        error: "Contraseña incorrecta"
      });
    }

    // Preparar respuesta
    const userDetails = user.toJSON();
    const token = await generateJWT(userDetails.id);

    return res.status(200).json({
      msg: "Login successful",
      userDetails: { token, user: userDetails }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      msg: "Login failed, server error",
      error: err.message
    });
  }
};

// Crea un superadmin (ejecutar una sola vez)
export const createAdmin = async () => {
  try {
    const exists = await User.exists({ role: "ADMIN_GLOBAL" });
    if (exists) {
      console.log("Superadmin ya existe.");
      return;
    }

    const hashedPassword = await hash("ADMIN@123");
    const superAdmin = new User({
      name: "Super Admin",
      surname: "Global",
      username: "superadmin",
      email: "superadmin@correo.com",
      password: hashedPassword,
      phone: "",
      role: "ADMIN_GLOBAL",
      status: true
    });

    await superAdmin.save();
    console.log("Superadmin creado.");
  } catch (err) {
    console.error("Error creando superadmin:", err.message);
  }
};

export default createAdmin;
