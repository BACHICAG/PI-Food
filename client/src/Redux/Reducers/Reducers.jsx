import {
  GET_RECIPE,
  FILTER_BY_DIET,
  ORDER_BY_TITLE,
  ORDER_BY_PTS,
  GET_BY_TITLE,
  GET_BY_ID,
  ADD_RECIPE,
  GET_DIET_TYPES,
  FILTER_BY_ORIGIN,
} from "../Actions/Types.jsx";

const initialState = {
  // Donde se almacenarán todas las recetas
  allRecipes: [],
  //Donde se almacenará las recetas que se filtran
  recipes: [],
  // Donde se alacenará el detalle de la receta
  detail: [],
  // Donde se almacenará los tipos de dietas
  dietTypes: [],
  // Recetas creadas del formulario
  formRecipe: [],
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_RECIPE:
      return {
        ...state,
        allRecipes: payload,
        recipes: payload,
      };

    case GET_BY_ID:
      return {
        ...state,
        detail: payload,
      };

    case GET_BY_TITLE:
      return {
        ...state,
        allRecipes: payload,
      };

    case GET_DIET_TYPES:
      return {
        ...state,
        dietTypes: payload,
      };

    case ADD_RECIPE:
      return {
        ...state,
        formRecipe: [...state.formRecipe, payload],
      };

    case FILTER_BY_DIET:
      const recipesArr = state.recipes;
      const dietTypeFltr =
        payload === "All"
          ? recipesArr
          : recipesArr.filter(
              (recipe) => recipe.diets && recipe.diets.includes(payload)
            );
      return {
        ...state,
        allRecipes: dietTypeFltr,
      };

    case FILTER_BY_ORIGIN:
      return {
        ...state,
        allRecipes: payload,
      };

    case ORDER_BY_TITLE:
      let orderedByTitle = [...state.recipes];

      if (payload === "asc") {
        orderedByTitle.sort((a, b) => {
          return a.nombre.toLocaleLowerCase() > b.nombre.toLocaleLowerCase() ? 1 : -1;
        });
      } else {
        orderedByTitle.sort((a, b) => {
          return a.nombre.toLocaleLowerCase() > b.nombre.toLocaleLowerCase() ? -1 : 1;
        });
      }
      return {
        ...state,
        allRecipes: orderedByTitle,
      };

    case ORDER_BY_PTS:
      const orderedByPts = [...state.recipes].sort((a, b) =>
        payload === "lowhigh"
          ? a.health_score - b.health_score
          : b.health_score - a.health_score
      );
      return {
        ...state,
        allRecipes: orderedByPts,
      };

    default:
      return state;
  }
};

export default rootReducer;
