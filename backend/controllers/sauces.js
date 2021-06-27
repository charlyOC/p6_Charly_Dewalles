
// je récupère le model de la sauce
const Sauce = require('../model/sauces');

// je récupère le module fs (file system), qui permet d'eploiter les images et les modifier 
const fs = require('fs');

//middleware pour créer la sauce
exports.createSauce = (req, res, next) => {
  // on récupère les données du frontend et on les transforme en objet js
  const sauceObject = JSON.parse(req.body.sauce);
  // on supprime l'ID généré automatiquement par mongodb
  delete sauceObject._id;
  // je crée l'instance dans la base de donnée
  const sauce = new Sauce({
    //j'utilise le spead operator pour récupérer tous les éléments et les modifier
    ...sauceObject,
    //je récupère l'image et la rend dynamique
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    // je set up dans la base de donnée les like et dislike 
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
  // j'envoie une réponse au front pour dire que le résultat a été successful 
  .then(() => res.status(201).json({ message: 'sauce enregistrée'}))
  //sinon on envoie une erreur de requête
  .catch(error => res.status(400).json({ error }));
};


//middleware pour modifier la sauce
exports.modifySauce = (req, res, next) => {
  // création de l'objet sauce par défaut
  let sauceObject = {};

  //utilisation de l'opérateur ternaire pour voir si req.fil existe
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      //s'il n'existe pas on parse pour récupérer la requête envoyé et on génère l'url de l'image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    }
    //s'il n'existe pas, copie de req.body de la sauce 
    ) : ( sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(
    {
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    }
  )
  .then(() => res.status(200).json({
    message: 'Sauce modifiée !'
  }))
  .catch((error) => res.status(400).json({
    error
  }))
};

exports.deleteSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({message: 'objet supprimé'}))
        .catch(error => res.status(400).json({error}));
      });
  })
  .catch(error => res.status(400).json(error));

};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ message: 'objet non trouvé'}));
};

exports.getSauces = (req, res, next) => {
  Sauce.find()
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }));
};

exports.likeAndDislike = (req, res, next) => {

  const like = req.body.like

  const userId = req.body.userId

  const sauceId = req.params.id

  if (like === 1) { 
    Sauce.updateOne({
        _id: sauceId
      }, {
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        }, 
      })
      .then(() => res.status(200).json({
        message: "Vous aimez cette sauce !"
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }

  if (like === -1) {
    Sauce.updateOne(
      {
        _id: sauceId
      }, {
        $push: {
          usersDisliked: userId
        },
        $inc: {
          dislikes: +1
        }, 
      }
    )
    .then(() => {
      res.status(200).json({
        message: "Vous n'aimez pas cette sauce... :("
      })
    })
    .catch((error) => res.status(400).json({
      error
    }))
  }

  if (like === 0){

    Sauce.findOne( {
      _id: sauceId 
    })

    .then((sauce) => {

      if  (sauce.usersLiked.includes(userId)){

        Sauce.updateOne({_id: sauceId}, { $inc: { likes: -1} , $pull: { usersLiked: userId}, _id: sauceId })
          .then( () => res.status(200).json({ message: 'Vous avez retiré votre like' }))
        .catch( error => res.status(400).json({ error}))

      }

      if  (sauce.usersDisliked.includes(userId)) {

        Sauce.updateOne( {_id: sauceId}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId}, _id: sauceId})
          .then( () => res.status(200).json({ message: 'Vous avez retiré votre dislike' }))
        .catch( error => res.status(400).json({ error}))

      } 

    }).catch( error => res.status(400).json({ error}))              
  }
 
}