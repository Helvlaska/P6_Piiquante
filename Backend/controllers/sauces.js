/**********CE DONT J'AI BESOIN**********/
const Sauce = require('../models/sauces'); //import du model user
const fs = require('fs'); //accès aux fonctions qui nous permettent de supprimer les fichiers

/**********LOGIQUE METIER**********/

exports.createSauce = (req, res, next) => { //Ajout d'une nouvelle sauce
    const sauceObject = JSON.parse(req.body.sauce); // récupère les infos du formulaire de création de sauce
    delete sauceObject._id; // supprime l'id de la sauce par défaut
    delete sauceObject._userId; // supprime l'id du user par défaut
    const sauce = new Sauce({ // création d'un nouvel obj "user" via le model
        ...sauceObject,
        userId: req.auth.userId, // Lie la sauce au userId
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // traitement du fichier image
    });
  
    sauce.save() // sauvegarde de l'obj sauce dans la base de données
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})}) 
    .catch(error => { res.status(400).json( { error })}) 
 };

exports.getOneSauce = (req, res, next) => { //Récupérer une sauce
    Sauce.findOne({ // dans la collection sauce rechercher une sauce...
    _id: req.params.id // ... avec son id
  }).then(
    (sauce) => { // renvoie la sauce recherchée 
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => { // envoie une erreur console
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => { //Modifier une sauce
    const sauceObject = req.file ? { // nouvelle obj qui regarde les modifications apportées a la sauce du body
        ...JSON.parse(req.body.sauce), // récupérations des données du body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // récupération image
    } : { ...req.body };
  
    delete sauceObject._userId; // supprime le userId client pour verifier que le user est bien le createur de l'obj (token)
    Sauce.findOne({_id: req.params.id}) // recherche dans la collection sauce, la sauce du body
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) { // si l'user n'est pas propriétaire de la sauce
                res.status(401).json({ message : 'Not authorized'}); // envoie une erreur console
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // si l'user est le propriétaire de la sauce faire les modifications
                .then(() => res.status(200).json({message : 'Objet modifié!'})) // modifications acceptées
                .catch(error => res.status(401).json({ error })); // alerte console en cas de problèmes
            }
        })
        .catch((error) => {
            res.status(400).json({ error }); // alerte console en cas de problèmes
        });
 };

exports.deleteSauce = (req, res, next) => { //Supprimer une sauce
    Sauce.findOne({ _id: req.params.id}) // recherche dans la collection sauce, la sauce du body
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { // si le user n'est pas propriétaire de la sauce, l'action n'est pas autorisée
                res.status(401).json({message: 'Not authorized'});
            } else { // sinon...
                const filename = sauce.imageUrl.split('/images/')[1]; //... suppression de l'image
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id}) // ... suppression de l'obj
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error })); // alerte console en cas de problèmes
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error }); // alerte console en cas de problèmes
        });
 };

exports.getAllSauce = (req, res, next) => { //Récuperer toutes les sauces
    Sauce.find()
    .then((sauce) => { // pointe et renvoie la collection sauce de la base de données coté client
      res.status(200).json(sauce);
    })
    .catch((error) => { // alerte console en cas de problèmes
      res.status(400).json({error: error});
    });
};

exports.likeSauce = (req, res, next) => { //Gestion des Likes et Dislikes
  
  const sauceId = req.params.id; // Récupère l'ID de la sauce à partir des paramètres de la requête
  const userId = req.body.userId; // Récupère l'ID de l'utilisateur à partir du corps de la requête
  const like = req.body.like; // Récupère la valeur du like à partir du corps de la requête

  Sauce.findById(sauceId) // Recherche la sauce dans la base de données par son ID
  
    .then(sauce => {
      if (!sauce) { // Si la sauce n'est pas trouvée, renvoie une réponse 404
        return res.status(404).json({ message: 'Sauce non trouvée' }); 
      }
      
      const userIndexLiked = sauce.usersLiked.indexOf(userId); // permet de gérer les ajouts et suppressions dans le tableau usersLiked
      const userIndexDisliked = sauce.usersDisliked.indexOf(userId); // permet de gérer les ajouts et suppressions dans le tableau usersDislikes
      
      if (like === 1 && userIndexLiked === -1) { // L'user like la sauce et n'est pas dans l'array like
        sauce.likes++; // incrémente 1 au compteur likes
        sauce.usersLiked.push(userId); // envoie l'userId dans le tableau likes
      
      } else if (like === 0 && userIndexLiked !== -1) { // L'user annule son like et est dans l'array like
          sauce.likes--; // enlève 1 au compteur like
          sauce.usersLiked.splice(userIndexLiked, 1); // retire l'userId de l'array Like

      } else if (like === -1 && userIndexDisliked === -1) { // L'user dislike et n'est pas dans l'array dislike
          sauce.dislikes++; // incrémente 1 au compteur dislike
          sauce.usersDisliked.push(userId); // envoie l'userId dans l'array dislike

      } else if (like === 0 && userIndexDisliked !== -1) { // L'utilisateur annule son dislike et est dans l'array dislike
          sauce.dislikes--; // enlève 1 au compteur dislike
          sauce.usersDisliked.splice(userIndexDisliked, 1); // retire l'userId de l'array dislike
      }

      return sauce.save() // Enregistre les modifications dans la base de données
        .then(updatedSauce => {
          return res.status(200).json(updatedSauce); // Répond avec la sauce mise à jour
        });
    })
    .catch(error => { // alerte console en cas de problèmes
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' }); 
    });
};
