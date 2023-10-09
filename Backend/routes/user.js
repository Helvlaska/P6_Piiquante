/**********CE DONT J'AI BESOIN**********/
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); // import du modèle user

/**********ROUTES**********/
router.post('/signup', userCtrl.signup); // envoie un nouveau user à la base de données 
router.post('/login', userCtrl.login); // envoie et vérifie les données de connection du user via la base de données 

// importable partout dans le projet
module.exports = router;