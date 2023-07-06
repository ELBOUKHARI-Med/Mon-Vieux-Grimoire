const express = require ('express');
const booksCtrl = require('../controllers/books.controller');
const { upload } = require("../middlewares/multer");
const authMdlle = require("../middlewares/auth");
const booksRouter = express.Router();
booksRouter.get("/bestrating", booksCtrl.getBestRating); // Route pour obtenir les livres avec les meilleures évaluations
booksRouter.get("/:id", booksCtrl.getBookById);// Route pour obtenir un livre par son ID
booksRouter.get("/", booksCtrl.getBooks);// Route pour obtenir tous les livres
booksRouter.post("/", authMdlle, upload.single("image"), booksCtrl.postBook);// Route pour ajouter un nouveau livre
booksRouter.delete("/:id", authMdlle, booksCtrl.deleteBook);// Route pour supprimer un livre par son ID
booksRouter.put("/:id", authMdlle, upload.single("image"), booksCtrl.putBook);// Route pour mettre à jour un livre par son ID
booksRouter.post("/:id/rating", authMdlle, booksCtrl.postRating);// Route pour ajouter une évaluation à un livre

module.exports = { booksRouter };