const { Router } = require("express");

//Controllers
const { getRecipesFromDB } = require("../Controllers/getRecipesFromDB.js");

const recipeByDB = Router();

// Ruta para buscar recetas por nombre
recipeByDB.get("/", getRecipesFromDB);

module.exports = recipeByDB;
