/**********CE DONT J'AI BESOIN**********/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**********MODEL**********/
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Ajout d'un plugin pour qu'un identifiant soit unique
userSchema.plugin(uniqueValidator);

//model importable partout dans le projet
module.exports = mongoose.model('User', userSchema);