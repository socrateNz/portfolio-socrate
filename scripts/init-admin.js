require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Modèle User (copié du modèle TypeScript)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    console.log('Tentative de connexion à:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'etarcos3@gmail.com' });
    if (existingAdmin) {
      console.log('L\'utilisateur admin existe déjà');
      process.exit(0);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('Etarcos123', 12);

    // Créer l'utilisateur admin
    const adminUser = new User({
      username: 'admin',
      email: 'etarcos3@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Utilisateur admin créé avec succès');
    console.log('Email: etarcos3@gmail.com');
    console.log('Mot de passe: Etarcos123');
    console.log('N\'oubliez pas de changer ces identifiants en production !');

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminUser();
