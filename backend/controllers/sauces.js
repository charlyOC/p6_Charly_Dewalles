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
        const filename = sauce.imageUrl.split('/images')[1];
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

  const like = req.body.like; 
  const userId = req.body.userId;

  if (req.body.like == 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { like: +1 },
      }
    )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
  }


  if (req.body.like == -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislike: 1 },
      }
    )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
  }

}