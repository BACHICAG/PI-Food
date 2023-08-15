const { Router } = require("express");

//Controllers
const { getRecipeById } = require("../Controllers/getRecipeById.js");

const recipeRouterById = Router();

// Ruta para obtener el detalle de una receta específica por su ID
recipeRouterById.get("/:idRecipe", getRecipeById);

module.exports = recipeRouterById;
