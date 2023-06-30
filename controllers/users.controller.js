const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");



//Cette fonction gère le processus d'inscription d'un utilisateur. Elle récupère l'email et le mot de passe à partir de la requête (req)
async function signUp(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (email == null || password == null) {
    res.status(400).send("L'e-mail et le mot de passe sont requis");// Vérifie si l'email et le mot de passe sont fournis
    return;
  }

  try {
    const userInDb = await User.findOne({
      email: email
    });
    if (userInDb != null) {
      res.status(400).send("L'e-mail existe déjà");// Vérifie si l'email existe déjà dans la base de données
      return;
    }
    const user = {
      email,
      password: hashPassword(password) // Hash du mot de passe avant de le stocker
    };
    await User.create(user); // Crée un nouvel utilisateur dans la base de données
    res.send("Sign up");// Réponse de réussite de l'inscription
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite");// Réponse d'erreur en cas de problème lors de l'inscription
  }
}

//Cette fonction gère le processus de connexion d'un utilisateur
async function login(req, res) {
  const body = req.body;
  if (body.email == null || body.password == null) {
    res.status(400).send("L'e-mail et le mot de passe sont requis"); // Vérifie si l'email et le mot de passe sont fournis
    return;
  }
  try {
    const userInDb = await User.findOne({
      email: body.email
    });
    if (userInDb == null) {
      res.status(401).send("Identifiants incorrects");// Vérifie si l'utilisateur existe dans la base de données
      return;
    }
    const passwordInDb = userInDb.password;
    if (!isPasswordCorrect(req.body.password, passwordInDb)) {
      res.status(401).send("Identifiants incorrects");// Vérifie si le mot de passe est correct
      return;
    }

    res.send({
      userId: userInDb._id,
      token: generateToken(userInDb._id) // Génère un token JWT pour l'utilisateur
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Une erreur s'est produite");// Réponse d'erreur en cas de problème lors de la connexion
  }
}

//Cette fonction génère un token JWT en utilisant l'ID de l'utilisateur fourni
function generateToken(idInDb) {
  const payload = {
    userId: idInDb
  };
  const jwtSecret = String(process.env.JWT_SECRET);
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "1d"
  });
  return token; // Génère un token JWT avec une durée de validité d'un jour
}

//Cette fonction hache le mot de passe fourni en utilisant la fonction de hachage bcrypt
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash; // Hache le mot de passe en utilisant la fonction de hachage bcrypt
}

// Cette fonction compare le mot de passe fourni avec le hachage stocké pour vérifier si le mot de passe est correct
function isPasswordCorrect(password, hash) {
  return bcrypt.compareSync(password, hash); // Vérifie si le mot de passe fourni correspond au hachage stocké
}

module.exports = {signUp, login };
