const {Recipe, Diet} = require("../db.js");

// Variable para mantener el valor del próximo "id" a asignar
let nextId = 1165540;

async function postRecipe(req, res) {
  const {
    nombre,
    imagen,
    resumen_plato,
    health_score,
    paso_a_paso,
    diets,
  } = req.body;
  
  try {
    // Creamos la receta en la base de datos
    const newRecipe = await Recipe.create({
      id: nextId,
      nombre,
      imagen,
      resumen_plato,
      health_score,
      paso_a_paso,
    });

    // Incrementamos el "id" para la siguiente receta
    nextId++;

    // Aquí vamos a buscar y agregar las dietas a la receta
    if (diets && diets.length > 0) {
      for (const dietName of diets) {
        const diet = await Diet.findOne({
          where: { nombre: dietName },

        });
        await newRecipe.addDiet(diet);
      }
    }

    // Recuperamos nuevamente la receta con la relación Diet ya incluida
    const recipeWithDiets = await Recipe.findByPk(newRecipe.id, {
      include: [
        {
          model: Diet,
          // Aquí especificamos los campos que queremos incluir y evitamos que se incluya el id
          attributes: ["nombre"],
          // Aquí evitamos la inclusión de RecipeDiets
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json(recipeWithDiets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  postRecipe,
};

// {
//   "id": "1165540",
// "nombre": "Huevo hervido",
// "imagen": "https://img.freepik.com/fotos-premium/huevo-cocido-rodajas-foto-comida_693630-1856.jpg",
// "resumen_plato": "Huevo hervido en agua",
// "health_score": "9",
// "paso_a_paso": "Colocar el huvo a hervir en agua por el tiempo que sea necesario dependiendo de como queires que quede el huvo por dentro",
// "diets": ["vegan", "gluten free"]
// }