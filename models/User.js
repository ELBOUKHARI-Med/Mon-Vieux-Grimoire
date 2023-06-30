// Importer le module Mongoose
const mongoose = require("mongoose");

// Définir le schéma de données pour le modèle "User"
const UserSchema = new mongoose.Schema({
  email: String, // Adresse e-mail de l'utilisateur
  password: String // Mot de passe de l'utilisateur
});

// Créer le modèle "User" en utilisant le schéma défini
const User = mongoose.model("User", UserSchema);

// Exporter le modèle "User" pour être utilisé dans d'autres modules
module.exports = { User };
