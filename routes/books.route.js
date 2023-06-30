const express = require ('express');
const booksCtrl = require('../controllers/books.controller');
const { upload } = require("../middlewares/multer");

// gére les fichier images 
const multer = require('../middlewares/multer');

const booksRouter = express.Router();
booksRouter.get("/bestrating", booksCtrl.getBestRating); // Route pour obtenir les livres avec les meilleures évaluations
booksRouter.get("/:id", booksCtrl.getBookById);// Route pour obtenir un livre par son ID
booksRouter.get("/", booksCtrl.getBooks);// Route pour obtenir tous les livres
booksRouter.post("/", booksCtrl.checkToken, upload.single("image"), booksCtrl.postBook);// Route pour ajouter un nouveau livre
booksRouter.delete("/:id", booksCtrl.checkToken, booksCtrl.deleteBook);// Route pour supprimer un livre par son ID
booksRouter.put("/:id", booksCtrl.checkToken, upload.single("image"), booksCtrl.putBook);// Route pour mettre à jour un livre par son ID
booksRouter.post("/:id/rating", booksCtrl.checkToken, booksCtrl.postRating);// Route pour ajouter une évaluation à un livre

module.exports = { booksRouter };