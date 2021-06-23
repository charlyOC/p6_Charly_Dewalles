const Sauce = require('../model/sauces');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce.save()
  .then(() => res.status(201).json({ message: 'sauce enregistrée'}))
  .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
      Sauce.findOne({
        _id: req.params.id
      }).then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlinkSync(`images/${filename}`)
      }),
      sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
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