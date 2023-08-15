const { Router } = require("express");

//Controllers
const { getDiets } = require("../Controllers/getDiets.js");

const recipeRoutesByDiets = Router();

// Ruta para obtener el detalle de una receta específica por su ID
recipeRoutesByDiets.get("/", getDiets);

module.exports = recipeRoutesByDiets;
