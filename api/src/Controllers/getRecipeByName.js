// Importamos axios
const axios = require("axios");

// Importamos el operador Op de Sequelize
const { Op } = require("sequelize");

//Importamos la URL y la API_KEY del .env
const dotenv = require("dotenv");
dotenv.config();
const { SPOONACULAR_URL, API_KEY } = process.env;

// Importamos los modelos
const { Diet, Recipe } = require("../db.js");

async function getRecipeByName(req, res) {
  const { name } = req.query;

  try {
    /*
      Codificamos el valor de "name" con "encodeURIComponent()"" antes de agregarlo a la URL.
      Esto asegurará que cualquier carácter especial en el nombre de la receta sea tratado
      adecuadamente en la URL.
    */
    const encodedName = encodeURIComponent(name);

    const axiosResponse = await axios.get(
      `${SPOONACULAR_URL}complexSearch?apiKey=${API_KEY}&number=1165539&addRecipeInformation=true&query=${encodedName}`
    );

    // Obtenemos todas las recetas encontradas en la API
    // Pasamos la respuesta de la API a una variable. como si se "destructurara"
    const recipesFromAPI = axiosResponse.data.results;

    // Buscamos las recetas en la base de datos que tengan el nombre (parcial o exacto)
    const recipesFromDB = await Recipe.findAll({
      where: { nombre: { [Op.iLike]: `%${name}%` } },
      include: [
        {
          model: Diet,
          attributes: ["nombre"],
          through: { attributes: [] },
        },
      ],
    });

    // Combinamos las recetas de la API y la base de datos
    const allRecipes = [...recipesFromAPI, ...recipesFromDB];

    if (allRecipes.length === 0) {
      return res.status(404).json({ message:`No se encontró ninguna receta con el nombre: ${name}` });
    }

    //Recetas válidas
    const validRecipes = [];

    //Recetas inválidas
    const invalidRecipes = [];

    for (const recipe of allRecipes) {
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
      }

      // Pudo hacer la solicitud y SÍ encontró la receta por ese nombre.
      else {
        const stepsArray = recipe.analyzedInstructions[0].steps.map(stepObj => stepObj.step);
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
        }
        else if (recipe.id !== null || recipe.id !== undefined) {
          responseObject.id = recipe.id;
        }
        return responseObject;
      }),
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getRecipeByName,
};
