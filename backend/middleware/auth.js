//vérification de l'authentification du user avant l'envoi de ses requêtes

//je récupère le package jwt
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        //je récupère le header authorization, qu'on va split pour avoir 'bearer' en 1er élément 
        //et le token en 2eme élément 
        const token = req.headers.authorization.split(' ')[1];
        //je décode le token avec la clé qui devient un objet js 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // je récupère le userId qui est dans l'objet
        const userId = decodedToken.userId;

        // si ça ne correspond pas on renvoie une erreur
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant utilisateur non valable';
        } else {
            next();
        }
    } catch (error){
        res.status(401).json({
            error: error | ('requête invalide')
        });
    }
};