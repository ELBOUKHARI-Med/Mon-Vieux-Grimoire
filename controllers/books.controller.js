const { upload } = require("../middlewares/multer");
const { Book } = require("../models/Book");
const express = require("express");
const jwt = require("jsonwebtoken");

// Fonction pour ajouter une évaluation à un livre
async function postRating(req, res) {
  const id = req.params.id;
  if (id == null || id == "undefined") {
    res.status(400).send("L'ID du livre est manquant");// Vérifie si l'ID du livre est fourni
    return;
  }
  const rating = req.body.rating;
  const userId = req.tokenPayload.userId;
  try {
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Livre non trouvé");// Vérifie si le livre existe dans la base de données
      return;
    }
    const ratingsInDb = book.ratings;
    const previousRatingFromCurrentUser = ratingsInDb.find((rating) => rating.userId == userId);
    if (previousRatingFromCurrentUser != null) {
      res.status(400).send("Vous avez déjà évalué ce livre");// Vérifie si l'utilisateur a déjà évalué ce livre
      return;
    }
    const newRating = { userId, grade: rating };
    ratingsInDb.push(newRating);
    book.averageRating = calculateAverageRating(ratingsInDb);// Calcule la nouvelle note moyenne du livre
    await book.save();
    res.send("Rating posted");
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}

// Fonction pour calculer la note moyenne des évaluations
function calculateAverageRating(ratings) {
  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  return sumOfAllGrades / ratings.length;// Calcule la note moyenne en faisant la somme de toutes les notes et en les divisant par le nombre total de notes
}

// Fonction pour obtenir les livres avec les meilleures évaluations
async function getBestRating(req, res) {
  try {
    // Récupère les trois meilleurs livres classés par note décroissante
    const booksWithBestRatings = await Book.find().sort({ rating: -1 }).limit(3);// Récupère les trois meilleurs livres classés par note décroissante
    booksWithBestRatings.forEach((book) => {
      // Met à jour l'URL de l'image avec le chemin absolu
      book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    });
    res.send(booksWithBestRatings);
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}

// Fonction pour mettre à jour un livre par son ID
async function putBook(req, res) {
  const id = req.params.id;

  const book = JSON.parse(JSON.stringify(req.body));
  try {
     // Recherche le livre dans la base de données par son ID
    const bookInDb = await Book.findById(id);
    if (bookInDb == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    const userIdInDb = bookInDb.userId;
    const userIdInToken = req.tokenPayload.userId;
    if (userIdInDb != userIdInToken) {
      res.status(403).send("Vous ne pouvez pas modifier les livres d'autres personnes");
      return;
    }
    // Crée un nouvel objet contenant les mises à jour du livre
    const newBook = {};
    if (book.title) newBook.title = book.title;
    if (book.author) newBook.author = book.author;
    if (book.year) newBook.year = book.year;
    if (book.genre) newBook.genre = book.genre;
    if (req.file != null) newBook.imageUrl = req.file.filename;

    // Met à jour le livre dans la base de données en utilisant son ID
    await Book.findByIdAndUpdate(id, newBook);
    res.send("Livre mis à jour");
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}

//Cette fonction gère la suppression d'un livre
async function deleteBook(req, res) {
  const id = req.params.id;
  try {
    // Recherche le livre dans la base de données par son ID
    const bookInDb = await Book.findById(id);
    if (bookInDb == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    const userIdInDb = bookInDb.userId;
    const userIdInToken = req.tokenPayload.userId;
    if (userIdInDb != userIdInToken) {
      res.status(403).send("Vous ne pouvez pas modifier les livres d'autres personnes");
      return;
    }
    // Supprime le livre de la base de données en utilisant son ID
    await Book.findByIdAndDelete(id);
    res.send("Livre supprimé");
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}



// Cette fonction récupère un livre de la base de données en utilisant son ID. Si le livre n'est pas trouvé, une réponse avec le statut 404 est renvoyée
async function getBookById(req, res) {
  const id = req.params.id;
  try {
    // Recherche le livre dans la base de données par son ID
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    // Met à jour l'URL de l'image avec le chemin absolu
    book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    res.send(book);
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}

//Cette fonction gère l'ajout d'un nouveau livre dans la base de données
async function postBook(req, res) {
  const stringifiedBook = req.body.book;
  const book = JSON.parse(stringifiedBook);
  const filename = req.file.filename;
  book.imageUrl = filename;
  try {
    // Crée un nouveau livre dans la base de données
    const result = await Book.create(book);
    res.send({ message: "Livre ajouté", book: result });
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}

//Cette fonction récupère tous les livres de la base de données. Les livres récupérés sont ensuite parcourus et l'URL de l'image de chaque livre est mise à jour en utilisant la fonction getAbsoluteImagePath
async function getBooks(req, res) {
  try {
    // Récupère tous les livres de la base de données
    const books = await Book.find();
    books.forEach((book) => {
      book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    });
    res.send(books);
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite:" + e.message);
  }
}


//Cette fonction prend le nom de fichier d'une image et retourne le chemin absolu complet de l'image
function getAbsoluteImagePath(fileName) {
  return process.env.PUBLIC_URL + "/" + process.env.IMAGES_PUBLIC_URL + "/" + fileName;
}

module.exports = { getBestRating, getBookById, getBooks, postBook, deleteBook, putBook, postRating }
