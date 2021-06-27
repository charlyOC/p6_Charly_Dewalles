// importation d'express (framework node.js)
const express = require('express');

//importation de body-parser pour exploiter la requête POST de l'app front-end en JSON
const bodyParser = require('body-parser');

// importation de la base de donnée, en l'occurence ici mongoDB
const mongoose = require('mongoose');

// je sanitize la base de donnée pour éviter les injections
const mongoSanitize = require('express-mongo-sanitize')

const rateLimit = require('express-rate-limit');

// je limite le taux de requête en 15 minutes
const limiter = rateLimit({         
  windowMs: 15 * 60 * 1000,       
  max: 30
})

// accede à tous les chemins de fichiers
const path = require('path');

// protège les en-têtes HTTP pour empêcher les détournements de clic
const helmet = require('helmet');

//router pour les sauces
const saucesRoutes = require('./routes/sauces');

//router pourt les users
const userRoutes = require('./routes/user');

//ajout de dotenv pour "sécuriser" l'accès à la base de donnée
require('dotenv').config();

//connection à la base de donnée
mongoose.connect(process.env.MONGO_URL,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// création d'une application express
const app = express();

//mise en place des Headers pour que tout le monde puisse faire des requêtes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//je parse toute les requêtes
app.use(bodyParser.json());

// évite les injections dans la base de donnée mongodb
app.use(mongoSanitize({
  replaceWith: '_'
}))

//j'indique à mon app le fichier dans lequel il faut aller chercher les images
app.use('/images', express.static(path.join(__dirname, 'images')));


//route des sauces
app.use('/api/sauces', saucesRoutes);

//route des users
app.use('/api/auth', userRoutes);

// j'exporte l'application
module.exports = app;

