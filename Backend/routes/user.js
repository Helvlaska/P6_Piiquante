/**********CE DONT J'AI BESOIN**********/
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

/**********CONTROLLERS UTILISES**********/
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//routes/user importable partout dans le projet
module.exports = router;