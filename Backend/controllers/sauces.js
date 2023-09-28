/**********CE DONT J'AI BESOIN**********/
const Sauce = require('../models/sauces');
//accès aux fonctions qui nous permettent  de supprimer les fichiers.
const fs = require('fs');

/**********LOGIQUE METIER**********/
//Ajout d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

//Récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

//Récuperer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Gestion des Likes et Dislikes
exports.likes = (req, res, next) => {
  //Récupérer l'id de la sauce
  const sauceId = req.params.id; 
  //Récupérer l'id de l'user
  const userId = req.body.userId;
  
  Sauce.findById(sauceId) // Recherche le produit dans la base de données par son ID
    .then(sauce => {
      if (!sauce) {
        return res.status(404).json({ message: 'Sauce non trouvé' }); // Si le produit n'est pas trouvé, renvoie une réponse 404
      }
      // Vérifie si l'utilisateur a déjà voté et quel était son vote précédent
      const arrayLiked = sauce.usersLiked.indexOf(userId);
      const arrayDisliked = sauce.usersDisliked.indexOf(userId);

      if (arrayLiked === -1 && arrayDisliked === -1) {
        // L'utilisateur n'a pas encore voté, donc il vote "like"
        sauce.likes++;
        sauce.usersLiked.push(userId);
      } else if (arrayLiked !== -1) {
        // L'utilisateur avait déjà voté "like", donc il annule son vote
        sauce.likes--;
        sauce.usersLiked.splice(arrayLiked, 1);
      } else if (arrayDisliked !== -1) {
        // L'utilisateur avait déjà voté "dislike", donc il change son vote en "like"
        sauce.likes++;
        sauce.usersLiked.push(userId);

        sauce.dislikes--;
        sauce.usersLiked.splice(arrayDisliked, 1);
      }
      // Enregistre les modifications dans la base de données
      return sauce.save()
        .then(updatedSauce => {
            return res.status(200).json(updatedSauce); // Répond avec le produit mis à jour
        });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' }); // Gère les erreurs et renvoie une réponse 500 (Internal Server Error) en cas d'erreur.
    });
}
