const express = require("express");
const jwt = require("jsonwebtoken");

//Cette fonction est un middleware qui vérifie le jeton d'autorisation présent dans le header "Authorization"
function checkToken(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (authorization == null) {
    res.status(401).send("Non autorisé");
    return;
  }
  // Extrait le jeton d'autorisation du header "Authorization"
  const token = authorization.split(" ")[1];
  try {
    const jwtSecret = String(process.env.JWT_SECRET);
    // Vérifie la validité du jeton
    const tokenPayload = jwt.verify(token, jwtSecret);
    if (tokenPayload == null) {
      res.status(401).send("Non autorisé");
      return;
    }
    req.tokenPayload = tokenPayload;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Non autorisé");
  }
}
  module.exports = checkToken;