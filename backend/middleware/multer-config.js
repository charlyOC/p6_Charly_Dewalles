
//j'importe le package multer qui gère les fichiers entrants dans les requêtes
const multer = require('multer');

//on déclare le dictionnaire mime types pour définir les formats des images
const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png',
};

//j'utilise une fonction de multer diskStorage pour l'enregistrer sur le disque
const storage = multer.diskStorage({
    //élément destination qui va guider multer dans quel dossier afficher les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //élément filename qui va expliquer à multer quels noms de fichiers utiliser
    filename: (req, file, callback) => {
        //je génère un nom pour le fichier, on supprime les espaces en les remplaçant par (_)
        const name = file.originalname.split(' ').join('_');
        //je vais chercher les mimeTypes du dictionnaire pour créer l'extension du fichier
        // qui correspond au fichier envoyer par le frontend
        const extension = MIME_TYPES[file.mimetype];
        //j'appelle le callback
        //et on crée le filename entier en le rendant le plus unique possible avec le time stamp
        callback(null, name + Date.now() + '.' + extension);
    }
})

//exportation du module
module.exports = multer({storage}).single('image');