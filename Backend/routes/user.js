/**********CE DONT J'AI BESOIN**********/
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

/**********ROUTES**********/
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// importable partout dans le projet
module.exports = router;