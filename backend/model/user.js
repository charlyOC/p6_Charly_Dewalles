//modèle des users 
const mongoose = require('mongoose');

//package pour éviter plusieurs users qui partagent la même adresse email 
const uniqueValidator = require('mongoose-unique-validator');

//schema du user
const userSchema = mongoose.Schema({
    email: { type : String, required: true, unique: true },
    password: { type: String, required: true }
});

//plugin du mail unique
userSchema.plugin(uniqueValidator);


//j'exporte le module
module.exports = mongoose.model('User', userSchema);