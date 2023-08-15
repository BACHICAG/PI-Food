const { Router } = require("express");

//Controllers
const { getRecipes } = require("../Controllers/getRecipes.js");

const recipeRoutes = Router();

// Ruta para obtener el detalle de una receta específica por su ID
recipeRoutes.get("/", getRecipes);

module.exports = recipeRoutes;