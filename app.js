// Importer les modules nécessaires
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const { usersRouter } = require("./routes/users.route");
const { booksRouter } = require("./routes/books.route");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Configurer rate=limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Créer une instance d'application Express
const app = express();
// utiliser helmet 
app.use(helmet({
	crossOriginResourcePolicy: false,
  }));
// utiliser limiter
app.use(limiter)

// Importer le module de configuration de la base de données
require("./db/mongo.js");

// Définir le chemin du dossier contenant les images
const IMAGES_FOLDER = String(process.env.IMAGES_FOLDER);

// Utiliser le module CORS pour gérer les requêtes cross-origin
app.use(cors());
// Utiliser le middleware pour parser les données JSON
app.use(express.json());
// Définir un middleware pour servir les fichiers statiques depuis le dossier des images
app.use("/" + process.env.IMAGES_PUBLIC_URL, express.static(IMAGES_FOLDER));

app.get("/", (req, res) => res.send("Server running!"));

app.use("/api/auth", usersRouter);
app.use("/api/books", booksRouter);

app.listen(PORT, () => console.log(`Server is running on: ${PORT}`));

// Exporter l'application
module.exports = { app };
