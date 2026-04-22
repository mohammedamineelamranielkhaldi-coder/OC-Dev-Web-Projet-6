const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion MongoDB réussie !'))
  .catch((error) => {
    console.log('Erreur de connexion MongoDB :');
    console.log(error);
  });

// Middleware global
app.use(cors());
app.use(express.json());
app.use(helmet());

// Dossier statique pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
