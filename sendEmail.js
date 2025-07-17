// sendEmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction d'envoi
async function sendEmail() {
  const mailOptions = {
    from: `"Ton Nom" <${process.env.EMAIL_USER}>`,
    to: 'etarcos3@gmail.com',
    subject: 'Test avec Nodemailer et Gmail',
    text: 'Bonjour, ceci est un email de test depuis Nodemailer 🚀',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès :', info.response);
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
  }
}

sendEmail();