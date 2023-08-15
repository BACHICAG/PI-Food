const { Recipe, Diet } = require("../db.js");

async function getRecipesFromDB(req, res) {
  try {
    const recipesFromDB = await Recipe.findAll({
      include: Diet, // Esto agregará las dietas relacionadas a cada receta
    });

    const recipes = recipesFromDB.map((recipe)=> recipe.dataValues);

    const formattedRecipes = recipes.map((recipe) => ({
      id: recipe.id,
      nombre: recipe.nombre,
      imagen: recipe.imagen,
      resumen_plato: recipe.resumen_plato,
      health_score: recipe.health_score,
      paso_a_paso: recipe.paso_a_paso,
      diets: recipe.Diets.map((diet) => diet.dataValues.nombre),
    }));

    return res.status(200).json(formattedRecipes);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}

module.exports = {
  getRecipesFromDB,
};
