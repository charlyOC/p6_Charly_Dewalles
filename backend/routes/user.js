//je déclare express pour le récupérer
const express = require('express');

//je décalre le router d'express
const router = express.Router();

//j'importe le controller des user 
const userCtrl = require('../controllers/user');

//et je configure les routes de l'api
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//j'exporte le tout
module.exports = router;