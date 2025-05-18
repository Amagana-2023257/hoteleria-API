import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transporte de correo usando variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true para port 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Envía un correo electrónico.
 * @param {Object} options
 * @param {string} options.to - Destinatario(s), separado(s) por comas.
 * @param {string} options.subject - Asunto del correo.
 * @param {string} [options.text] - Texto plano del mensaje.
 * @param {string} [options.html] - HTML del mensaje.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"No-Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('No se pudo enviar el email');
  }
};

export default sendEmail;
