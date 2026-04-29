const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion MongoDB réussie !'))
  .catch((error) => {
    console.log('Erreur de connexion MongoDB :');
    console.log(error);
  });

// Middleware CORS complet
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );

  
  // Autoriser le chargement cross-origin des images
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
});






// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Désactiver uniquement la règle CORP de Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Dossier statique pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);






module.exports = app;
