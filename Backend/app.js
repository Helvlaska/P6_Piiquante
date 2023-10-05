/**********CE DONT J'AI BESOIN**********/
const express = require('express'); //pas besoin d'installer Bodyparser déjà intégré dans Express
const mongoose = require('mongoose');
const path = require('path');

/********ROUTES********/
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

// Express run
const app = express();

/**********MIDDLEWARE**********/

// Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Express récupère les données du body en format JSON
app.use(express.json());

// Connection a la base de données MongoDB
mongoose.connect('mongodb+srv://Helvlaska:lnORD605303@atlascluster.w3qjnpw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation des routes
app.use('/api/auth', userRoutes); // route pour signup et login
app.use('/images', express.static(path.join(__dirname, 'images'))); // route pour le traitement des images
app.use('/api/sauces', sauceRoutes); // route pour le traitement des sauces

// importable partout dans le projet
module.exports = app;