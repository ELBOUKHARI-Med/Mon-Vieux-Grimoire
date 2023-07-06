// Importer le module Mongoose
const mongoose = require("mongoose");

// URL de connexion à la base de données MongoDB
const DB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.tq1ya3n.mongodb.net/?retryWrites=true&w=majority`;
// Fonction asynchrone pour établir la connexion à la base de données
async function connect() {
  try {
    // Établir la connexion à la base de données en utilisant l'URL
    await mongoose.connect(DB_URL);
    // Afficher un message de connexion réussie dans la console
    console.log("Connected to DB");
  } catch (e) {
    // En cas d'erreur, afficher l'erreur dans la console
    console.error(e);
  }
}
// Appeler la fonction de connexion pour établir la connexion à la base de données
connect();
