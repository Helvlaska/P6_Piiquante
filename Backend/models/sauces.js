/**********CE DONT J'AI BESOIN**********/
const mongoose = require('mongoose');

/**********MODEL**********/
const sauceSchema = mongoose.Schema({
    
    userId : { type: String, required: true },
    name : { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    mainPepper : { type: String, required: true },
    imageUrl : { type: String, required: true },
    heat :{type: Number, min: 0, max: 10}, 
    likes : {type: Number, default: 0}, 
    dislikes :{type: Number, default: 0}, 
    usersLiked: { type: Array, default: [], required: true },
    usersDisliked :{ type: Array, default: [], required: true }
});

//model importable partout dans le projet
module.exports = mongoose.model('Sauces', sauceSchema);