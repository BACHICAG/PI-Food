// Importamos axios
const axios = require("axios");

//Importamos la URL y la API_KEY del .env
const dotenv = require("dotenv");
dotenv.config();
const { SPOONACULAR_URL, API_KEY } = process.env;

// Importamos los modelos
const { Diet, Recipe } = require("../db.js");

async function getRecipeById(req, res) {
  const { idRecipe } = req.params;

  try {
    // Verificamos si la receta ya existe en la base de datos
    const existingRecipe = await Recipe.findOne({
      where: { id: idRecipe },
      include: [
        {
          model: Diet,
          attributes: ["nombre"],
          through: { attributes: [] },
        },
      ],
    });

    if (existingRecipe) {
      return res.status(200).json(existingRecipe);
    }
    else {
      const axiosResponse = await axios.get(
        `${SPOONACULAR_URL}${idRecipe}/information?apiKey=${API_KEY}&addRecipeInformation=true`
      );

      // Destructuramos la respuesta de la API.
      const { data } = axiosResponse;

      // Verificamos si la propiedad 'code' existe en la respuesta
      if (data.hasOwnProperty("code")) {
        return res
          .status(404)
          .json({ message: `No se encontró la receta con el ID: ${idRecipe}` });
      }
      else if (
        !data.id ||
        !data.title ||
        !data.image ||
        !data.summary ||
        !data.analyzedInstructions ||
        data.analyzedInstructions.length === 0
      ) {
        return res
          .status(405)
          .json({ message: "Receta inválida recibida desde la API" });
      }
      else {

        // Ddevolviendo cada step del array steps
        const stepsArray = data.analyzedInstructions[0].steps.map(stepObj => stepObj.step);

        // Convertimos el arreglo a una cadena JSON con saltos de línea
        // const jsonString = JSON.stringify(stepsArray, null, 2);

        // Creamos un objeto temporal con los datos de la receta
        const tempRecipe = {
          id: Number(data.id),
          origin: "API",
          nombre: data.title,
          imagen: data.image,
          resumen_plato: data.summary,
          health_score: data.healthScore,
          paso_a_paso: stepsArray,
        };

        // Aquí vamos a buscar y agregar las dietas a la receta
        if (data.diets && data.diets.length > 0) {
          for (const dietName of data.diets) {
            const [diet, _] = await Diet.findAll({
              where: { nombre: dietName },
            });
            tempRecipe.diets = tempRecipe.diets || [];
            tempRecipe.diets.push(diet.nombre);
          }
        }

        return res.status(200).json(tempRecipe);
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  getRecipeById,
};
