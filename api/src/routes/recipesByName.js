const { Router } = require("express");

//Controllers
const { getRecipeByName } = require("../Controllers/getRecipeByName.js");

const recipeRouterByName = Router();

// Ruta para buscar recetas por nombre
recipeRouterByName.get("/", getRecipeByName);

module.exports = recipeRouterByName;
