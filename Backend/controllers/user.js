/**********CE DONT J'AI BESOIN**********/
const bcrypt = require('bcrypt'); //cryptage du mdp
const User = require('../models/user'); //import du model user
const jwt = require('jsonwebtoken'); // token : vérification de l'intégrité et de l'authenticité des données

/**********LOGIQUE METIER**********/

exports.signup = (req, res, next) => { // Fonction pour l'inscription

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; // Regex pour valider l'adresse e-mail
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Regex pour valider le mot de passe (au moins 8 caractères, une majuscule et un chiffre)

	if (!emailRegex.test(req.body.email)) {
        	console.error('Adresse e-mail non valide'); // fficher un message d'erreur dans la console
        	return res.status(400).json({ message: 'Adresse e-mail non valide' }); // Renvoyer une réponse JSON
    	} else if (!passwordRegex.test(req.body.password)) {
        	console.error('Mot de passe non valide'); // Afficher un message d'erreur dans la console
        	return res.status(400).json({ message: 'Mot de passe non valide' }); // Renvoyer une réponse JSON
    	} 
	else {
        bcrypt.hash(req.body.password, 10) // Si les deux regex sont valides, hacher le mot de passe et continuer le traitement
            .then(hash => {
            const user = new User({ // Création d'un nouvel objet "user" via le modèle
                email: req.body.email,
                password: hash
            });
            user.save() // Sauvegarde dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // Alerte console en cas de problèmes
    }
};


exports.login = (req, res, next) => { // fonction pour la connection
    User.findOne({ email: req.body.email }) // Recherche dans la collection "user" si l'email existe
        .then(user => {
            if (!user) { // si l'email n'est pas bon retourner une erreur console
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password) // bcrypt compare le mdp donné a celui de la base de données lié a l'email 
                .then(valid => {
                    if (!valid) { // si non valide retourner une erreur console
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({ // si mdp ok attribution d'un userId et d'un token
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // alerte console en cas de problèmes
        })
    .catch(error => res.status(500).json({ error })); // alerte console en cas de problèmes
    
};