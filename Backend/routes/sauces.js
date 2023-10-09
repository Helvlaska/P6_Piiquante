const express = require('express');
/**********CE DONT J'AI BESOIN**********/
const router = express.Router();
const sauceCtrl = require('../controllers/sauces'); // import du modèle sauce

const auth = require('../middleware/auth'); // gestion des autorisations (qui peu modifier quoi)
const multer = require('../middleware/multer-config'); // gestion des images

/**********ROUTES**********/
router.get('/', auth, sauceCtrl.getAllSauce); // récupère et affiche la totalité des sauces de la base de données (soumis a une autorisation)
router.post('/', auth,  multer, sauceCtrl.createSauce); // envoie une nouvelle sauce vers la base de données (soumis a une autorisation + gestion de l'image)
router.get('/:id', auth, sauceCtrl.getOneSauce); // récupère et affiche une sauce précise de la base de données (soumise a une autorisation)
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // modifie une sauce de la base de données (soumis a autorisation + gestion de l'image)
router.delete('/:id', auth, sauceCtrl.deleteSauce); // supprime une sauce de la base de données (soumis a autorisation)
router.post('/:id/like', auth, sauceCtrl.likeSauce); // envoie un vote like/dislike/neutre sur une sauce précise de la base de données (soumis a autorisation)

// importable partout dans le projet
module.exports = router;