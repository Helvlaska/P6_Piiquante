/**********CE DONT J'AI BESOIN**********/
const express = require('express');
//pas besoin d'installer Bodyparser déjà intégré dans Express
const mongoose = require('mongoose');
const path = require('path');
/********ROUTES********/
//const stuffRoutes = require('./routes/stuff'); (exemple)
const userRoutes = require('./routes/user');

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

//Express récupère les données du body en format JSON
app.use(express.json());

//Connection a la base de données MongoDB
mongoose.connect('mongodb+srv://Helvlaska:lnORD605303@atlascluster.w3qjnpw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Utilisation des routes
//app.use('/api/stuff', stuffRoutes); (exemple)
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

//express importable partout dans le projet
module.exports = app;