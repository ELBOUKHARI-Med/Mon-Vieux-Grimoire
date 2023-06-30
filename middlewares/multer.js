// Importer le module Multer
const multer = require("multer");
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

// Exporter l'instance de Multer pour être utilisée dans d'autres modules
module.exports = { upload };
