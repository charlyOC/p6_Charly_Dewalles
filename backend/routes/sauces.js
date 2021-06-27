//déclaration du framework express
const express = require('express');

//déclaration du router express
const router = express.Router();

//j'importe le middleware d'authentification pour s'assurer qu'un user est bien authentifié 
//avant de faire des requêtes
const auth = require('../middleware/auth');

//j'importe le middleware de multer 
const multer = require('../middleware/multer-config');

//j'importe les différentes fonctions pour créer, modifier, supprimer les sauces
const saucesCtrl = require('../controllers/sauces');

//route Post pour créer une sauce, vérification de l'authentification, gestion de l'image
router.post('/', auth, multer, saucesCtrl.createSauce);

//même chose mais modification
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//suppressiopn d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//affichage d'une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);

//affichage des sauces
router.get('/', auth, saucesCtrl.getSauces);

//affichage des likes et dislikes
router.post('/:id/like', auth, saucesCtrl.likeAndDislike);



module.exports = router;