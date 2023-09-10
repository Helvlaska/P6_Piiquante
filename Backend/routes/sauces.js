const express = require('express');
/**********CE DONT J'AI BESOIN**********/
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/**********ROUTES**********/
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth,  multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;