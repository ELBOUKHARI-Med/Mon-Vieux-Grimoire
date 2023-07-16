// Importer le module Multer
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs"); // Ajouter cette ligne pour importer le module fs
// Configuration du stockage des fichiers téléchargés
const storage = multer.diskStorage({
  // Spécifier le dossier de destination pour enregistrer les fichiers téléchargés
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  // Définir le nom de fichier pour les fichiers téléchargés
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique en utilisant le nom d'origine du fichier, l'horodatage et l'extension .jpg
    const fileName = file.originalname.toLowerCase() + Date.now() + ".jpg";
    cb(null, fileName);
  }
});

// Créer une instance de Multer avec la configuration de stockage
const upload = multer({
  storage
});

// Middleware pour le traitement des images avant de les enregistrer
const imageProcessingMiddleware = (req, res, next) => {
  if (req.file) {
    // Utiliser Sharp pour redimensionner l'image
    sharp(req.file.path)
      .resize(400, 300) // Définir la taille souhaitée
      .toFile(req.file.path.replace(".jpg", "_resized.jpg"), (err, info) => {
        if (err) {
          console.error("Erreur lors du redimensionnement de l'image :", err);
        }
        // Supprimer l'ancienne image non redimensionnée
        fs.unlinkSync(req.file.path);
        // Renommer le fichier redimensionné en utilisant le même nom que l'original
        fs.renameSync(
          req.file.path.replace(".jpg", "_resized.jpg"),
          req.file.path
        );
        next();
      });
  } else {
    next();
  }
};

// Exporter l'instance de Multer et le middleware de traitement des images
module.exports = { upload, imageProcessingMiddleware };
