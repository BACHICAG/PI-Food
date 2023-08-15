const axios = require("axios");

const { Diet } = require("../db.js");

const dotenv = require("dotenv");
dotenv.config();
const { SPOONACULAR_URL, API_KEY } = process.env;

// Función para precargar las dietas desde la API y guardarlas en la base de datos.

async function getDiets(req, res) {
  try {

    // Donde se guardará la respuesta general de axios.
    const axiosResponse = await axios.get(
      `${SPOONACULAR_URL}complexSearch?apiKey=${API_KEY}&number=2000&addRecipeInformation=true`
    );

    // Donde se guardará la respuesta del axios con el resultado especifico de las recetas.
    const recipesData = axiosResponse.data.results;

    // Donde se almacenarán los tipos de dietas sin que se repitan por utilazar el Set().
    const allDietsSet = new Set();
    
    // Filtramos las dietas para incluir solo las que están en la lista deseada.
    const allowedDiets = [
      "fodmap friendly", "ketogenic", "dairy free", "lacto ovo vegetarian",
      "pescetarian", "pescatarian", "paleolithic", "primal", "whole 30", "gluten free",
      "vegan", "vegetarian", "lacto vegetarian", "ovo vegetarian", "low fodmap"
    ];

    // Extraemos y almacenamos todas las dietas de las recetas en allDietsSet.
    // Solo se incliurán las recetas que se encuentren en la lista de allowedDiets.
    recipesData.forEach((recipe) => {
      const recipeDiets = recipe.diets.filter((diet) => allowedDiets.includes(diet));
      // Agregar al Set para evitar duplicados.
      recipeDiets.forEach((diet) => allDietsSet.add(diet));
    });

    // Convertimos el Set a un arreglo.
    const allDiets = Array.from(allDietsSet);

    // Creamos un arreglo de promesas para buscar o crear las dietas en la base de datos.
    const dietPromises = allDiets.map(async (diet) => {
      const lowerCaseDiet = diet.toLowerCase(); // Convertir a minúsculas
      
      // Verificar si la dieta ya existe en la base de datos antes de crearla.
      const existingDiet = await Diet.findOne({
        where: { nombre: lowerCaseDiet },
        defaults: { nombre: lowerCaseDiet },
      });
      
      // Al utilizar "findOrCreate" con la opción "defaults" se evita que se repitan nombres
      // de dietas en la base de datos, además, lo estoy guardando en la base de datos.
      if (!existingDiet) {
        const [record, created] = await Diet.findOrCreate({
          where: { nombre: lowerCaseDiet },
          defaults: { nombre: lowerCaseDiet },
        });
        return {
          id: record.id,
          nombre: record.nombre,
        };
      } else {
        // Si la dieta ya existe, simplemente devolvemos el registro existente.
        return {
          id: existingDiet.id,
          nombre: existingDiet.nombre,
        };
      }
    });

    // Esperamos a que se completen todas las promesas.
    const dietWithIdAndName = await Promise.all(dietPromises);

    // Obtenemos todas las dietas de la base de datos.
    // const allDietRecords = await Diet.findAll();

    // Extraemos solo los nombres de las dietas.
    // const dietNames = allDietRecords.map((dietRecord) => dietRecord.nombre);

    // Enviamos la respuesta con todas las dietas en formato JSON.
    console.log("Dietas precargadas en la base de datos correctamente");
    // console.log(dietWithIdAndName);
    return res.status(200).json(dietWithIdAndName);
  }
  catch (error) {
    console.error("Error al obtener las dietas:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getDiets,
};


// {
//   "nombre": "Huevo hervido",
//   "imagen": "https://img.freepik.com/fotos-premium/huevo-cocido-rodajas-foto-comida_693630-1856.jpg",
//   "resumen_plato": "Huevo hervido en agua",
//   "health_score": "9",
//   "paso_a_paso": "Colocar el huvo a hervir en agua por el tiempo que sea necesario dependiendo de como queires que quede el huvo por dentro",
//   "diets": ["vegan", "guten free"]
// }