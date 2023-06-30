// Importer le module Mongoose
const mongoose = require("mongoose");

// Définir le schéma de données pour le modèle "Book"
const BookSchema = new mongoose.Schema({
  userId: String, // ID de l'utilisateur lié au livre
  title: String, // Titre du livre
  author: String, // Auteur du livre
  year: Number, // Année de publication du livre
  genre: String, // Genre du livre
  imageUrl: String, // URL de l'image du livre
  ratings: [
    {
      userId: String, // ID de l'utilisateur qui a donné une note
      grade: Number // Note attribuée par l'utilisateur
    }
  ],
  averageRating: Number // Note moyenne du livre calculée à partir des notes des utilisateurs
});

// Créer le modèle "Book" en utilisant le schéma défini
const Book = mongoose.model("Book", BookSchema);

// Exporter le modèle "Book" pour être utilisé dans d'autres modules
module.exports = { Book };
