const express = require ('express');
const usersCtrl = require('../controllers/users.controller');
const usersRouter = express.Router();
usersRouter.post("/signup", usersCtrl.signUp);// Route pour l'inscription
usersRouter.post("/login", usersCtrl.login);// Route pour la connexion
module.exports = { usersRouter };