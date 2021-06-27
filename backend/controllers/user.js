//j'utilise le package bcrypt pour hasher le MDP du user
const bcrypt = require('bcrypt');
//j'utilise jsonwebtoken pour assigner un token au user au moment de ma connexion
const jwt = require('jsonwebtoken');

//je vais réupérer le model du user
const User = require('../model/user');


//on ajoute un nouvel user, on hash son mot de passe
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur ajouté' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


//connexion de l'utilisateur, assignation d'un token pour chaque session
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
           return res.status(401).json({ error: 'Utilisateur non trouvé'});
        }
        // on compare les MDP rentré avec le Hash de bcrypt
        bcrypt.compare(req.body.password, user.password)
        // si ce n'est pas valide (donc false), on renvoie 'MDP incorrect' 
        .then(valid => {
            if (!valid){
                return res.status(401).json({ error: 'mot de passe incorrect'});
            }
            //si bcrypt renvoie true, on crée un objet json avec le userId de la base de donnée
            res.status(200).json({
                userId: user._id,
                // on assigne un token avec la méthode jwt: jwt.sign()
                token: jwt.sign(
                    //objet userId du user
                    {userId: user._id},
                    //clé "secrète" pour l'encodage du token 
                    'RANDOM_TOKEN_SECRET',
                    //argument de config pour notre token de 24h
                    { expiresIn: '24h' }
                ),
            });
        })
        .catch(error => status(500).json({ error }))
    })
    .catch(error => status(500).json({ error }))
};