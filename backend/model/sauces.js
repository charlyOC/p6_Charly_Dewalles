
//modèle des sauce à envoyer à la base de donnée 

const mongoose = require('mongoose');


//bien regarder les specs du frontend et les types
const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true,
  },

  manufacturer: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  mainPepper: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true
  },

  heat: {
    type: Number,
    required: true
  },

  likes: { 
    type: Number, 
    default: 0 
  },

  dislikes: { 
    type: Number, 
    default: 0 
  },

  usersLiked: {
    type: [String]
  },

  usersDisliked: {
    type: [String]
  },
})


//j'exporte le module 
module.exports = mongoose.model('Sauce', sauceSchema);