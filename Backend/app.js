//ce dont j'ai besoin ...
const express = require('express');

//express run
const app = express();

//middleware
app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

//express importable partout dans le projet
module.exports = app;