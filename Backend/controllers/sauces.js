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
exports.incrementLikes = (req, res, next) => {
  //Récupérer l'id de la sauce
  const sauceId = req.params.id; 
  //Récupérer l'id de l'user
  const userId = req.body.userId;
  //Récupérer le statut de vote (like/dislike) ça on peu l'enlever, sert a rien 
  //const likeStatus = req.body.likes;

  //Dans la collection Sauce rechercher une sauce par son Id
  /*Sauce.findById(sauceId)
        .then(sauce => {
            //si il ne trouve pas la sauce = message dans la console
            if (!sauce) {
                return res.status(404).json({ message: 'sauce non trouvé' });
            }

            // Vérifier si l'utilisateur avait déjà voté pour ce produit

            //vérifie s'il est dans la liste des users qui ont aimé
            const userIndexInLiked = sauce.usersLiked.indexOf(userId);
            //vérifie s'il est dans la liste des users qui ont pas aimé
            const userIndexInDisliked = sauce.usersDisliked.indexOf(userId);

            //si l'user souhaite liker la sauce
            if (likeStatus === 'likes') {
                //et si il n'a pas déja liker la sauce
                if (userIndexInLiked === -1) {
                  sauce.likes++; // +1 au vote like
                  sauce.usersLiked.push(userId); //on ajoute l'id de l'user au tableau des likes
                    //et si il avait deja dislike la sauce
                    if (userIndexInDisliked !== -1) {
                      sauce.dislikes--; // -1 aux dislikes
                      sauce.usersDisliked.splice(userIndexInDisliked, 1); //ont retire l'id user du tableau dislikes
                    }
                } else {
                    // L'utilisateur annule son vote (like)
                    sauce.likes--;
                    sauce.usersLiked.splice(userIndexInLiked, 1);
                }
                //reformuler l'algo!!
            } else if (likeStatus === 'dislikes') {
                if (userIndexInDisliked === -1) {
                  sauce.dislikes++;
                  sauce.usersDisliked.push(userId);

                    if (userIndexInLiked !== -1) {
                      sauce.likes--;
                      sauce.usersLiked.splice(userIndexInLiked, 1);
                    }
                } else {
                    // L'utilisateur annule son vote (dislike)
                    sauce.dislikes--;
                    sauce.usersDisliked.splice(userIndexInDisliked, 1);
                }
            } else {
                return res.status(400).json({ message: 'Statut de vote invalide' });
            }

            // Enregistrer les modifications dans la base de données
            return sauce.save()
                .then(updatedSauce => {
                    return res.status(200).json(updatedSauce);
                });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ message: 'Erreur serveur' });
        });*/

  Sauce.findById(sauceId)
      .then(sauce => {
          if (!sauce) {
              return res.status(404).json({ message: 'Sauce non trouvé' });
          }

          if (!sauce.usersLiked.includes(userId)) {
              sauce.likes++;
              sauce.usersLiked.push(userId);

              // Vérifier si l'utilisateur avait déjà liké ce produit
              // Vérifier si l'utilisateur avait déjà disliké ce produit
              const indexOfLikedUser = sauce.usersLiked.indexOf(userId);
              const indexOfDislikedUser = sauce.usersDisliked.indexOf(userId);

              if (indexOfDislikedUser !== -1) {
                sauce.dislikes--;
                sauce.usersDisliked.splice(indexOfDislikedUser, 1);
              }

              // Enregistrer les modifications dans la base de données
              return sauce.save()
                  .then(updatedSauce => {
                      return res.status(200).json(updatedSauce);
                  });
          } else {
              // L'utilisateur annule son like
              sauce.likes--;
              sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);

              // Enregistrer les modifications dans la base de données
              return sauce.save()
                  .then(updatedSauce => {
                      return res.status(200).json(updatedSauce);
                  });
          }
      })
      .catch(error => {
          console.error(error);
          return res.status(500).json({ message: 'Erreur serveur' });
      });
}
