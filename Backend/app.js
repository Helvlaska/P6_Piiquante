//ce dont j'ai besoin ...
const express = require('express');

//express run
const app = express();

/**********MIDDLEWARE**********/

//Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

//express importable partout dans le projet
module.exports = app;