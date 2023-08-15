const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();
const { SPOONACULAR_URL, API_KEY } = process.env;

const { Diet } = require("../db.js");

async function getRecipes(req, res) {
  try {
    // Donde se guardará la respuesta general de axios.
    const axiosResponse = await axios.get(
      `${SPOONACULAR_URL}complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`
    );

    
    // Donde se guardará la respuesta del axios con el resultado especifico de las recetas.
    const recipesData = axiosResponse.data.results;

    if (recipesData.length === 0) {
      return res.status(404).json({ message: `No se encontró ninguna receta` });
    } else {
      //Recetas válidas
      const validRecipes = [];

      //Recetas inválidas
      const invalidRecipes = [];

      for (const recipe of recipesData) {
        if (
          !recipe.id ||
          !recipe.title ||
          !recipe.image ||
          !recipe.summary ||
          !recipe.analyzedInstructions ||
          recipe.analyzedInstructions.length === 0
        ) {
          // Guardamos las recetas inválidas en el arreglo "invalidRecipes"
          invalidRecipes.push(recipe);
        } else {
          const stepsArray = recipe.analyzedInstructions[0].steps.map(
            (stepObj) => stepObj.step
          );
          // Convertimos el arreglo a una cadena JSON con saltos de línea
          // const jsonString = JSON.stringify(stepsArray, null, 2);

          const recipeObj = {
            id: Number(recipe.id),
            origin: "API",
            nombre: recipe.title,
            imagen: recipe.image,
            resumen_plato: recipe.summary,
            health_score: recipe.healthScore,
            paso_a_paso: stepsArray,
          };

          // Aquí vamos a buscar y agregar las dietas a la receta
          if (recipe.diets && recipe.diets.length > 0) {
            for (const dietName of recipe.diets) {
              const [diet, _] = await Diet.findAll({
                where: { nombre: dietName },
              });
              recipeObj.diets = recipeObj.diets || [];
              recipeObj.diets.push(diet.nombre);
            }
          }
          validRecipes.push(recipeObj);
        }
      }
      return res.status(200).json({
        message: `${validRecipes.length} recetas encontradas con datos válidos y ${invalidRecipes.length} recetas encontradas con datos inválidos recibidos desde la API \n`,
        validRecipes,
        invalidRecipes: invalidRecipes.map((recipe) => {
          const responseObject = {};
          if (recipe.title !== null || recipe.title !== undefined) {
            responseObject.nombre = recipe.title;
          } else if (recipe.id !== null || recipe.id !== undefined) {
            responseObject.id = recipe.id;
          }
          return responseObject;
        }),
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
}

module.exports = {
  getRecipes,
};
