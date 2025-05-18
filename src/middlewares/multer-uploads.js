// src/middlewares/multer-uploads.js
import fs from 'fs';
import multer from 'multer';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const MAX_SIZE = 100000000;

/**
 * Crea configuración de multer para un directorio dado.
 * @param {string} destinationFolder Ruta relativa al directorio de subida.
 */
const createMulterConfig = (destinationFolder) => multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = join(CURRENT_DIR, destinationFolder);
      try {
        fs.mkdirSync(fullPath, { recursive: true });
      } catch (err) {
        return cb(err);
      }
      req.filePath = fullPath;
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      // Determinar base del nombre según tipo de upload
      let baseName;
      if (destinationFolder.includes('profile-pictures')) {
        // usar nombre de usuario autenticado o de body
        baseName = (req.user?.username || req.body.username || 'user').trim().replace(/\s+/g, '-').toLowerCase();
      } else {
        // para hoteles, usar nombre de hotel
        baseName = (req.body.name || 'hotel').trim().replace(/\s+/g, '-').toLowerCase();
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const randomNum = Math.floor(Math.random() * 10000);
      const extension = extname(file.originalname);
      const filename = `${baseName}-${timestamp}-${randomNum}${extension}`;
      cb(null, filename);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Solamente se aceptan archivos de los siguientes tipos: ${MIMETYPES.join(' ')}`));
  },
  limits: { fileSize: MAX_SIZE }
});

// Middleware para subir imagen de perfil de usuario
export const uploadProfilePicture = createMulterConfig('../../public/uploads/profile-pictures').single('profilePicture');

// Middleware para subir imágenes de hoteles (hasta 10 archivos)
export const uploadHotelImages = createMulterConfig('../../public/uploads/hotels').array('images', 10);
