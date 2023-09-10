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
    heat :{type: Number}, 
    likes : {type: Number}, 
    dislikes :{type: Number}, 
    usersLiked: { type: Array, default: [], required: true },
    usersDisliked :{ type: Array, default: [], required: true }
});

//model importable partout dans le projet
module.exports = mongoose.model('Sauces', sauceSchema);