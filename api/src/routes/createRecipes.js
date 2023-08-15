const { Router } = require("express");

//Controllers
const { postRecipe } = require("../Controllers/postRecipe.js");

const createRecipesRouter = Router();

// Ruta para crear una nueva receta
createRecipesRouter.post("/", postRecipe);

module.exports = createRecipesRouter;
