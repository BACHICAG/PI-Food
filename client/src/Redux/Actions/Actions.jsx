import axios from "axios";

//----------- ACTIONS TYPES -----------
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
} from "./Types.jsx";

//----------- ACTIONS CREATORS -----------

//********** GET **********

// Obtener las primeras 100 recetas

export function getRecipes() {
  return async (dispatch) => {
    const axiosRespond = await axios.get(`http://localhost:3001/recipes`);
    const respound = axiosRespond.data.validRecipes;
    // Filtro por Base de Datos
    const axiosResponse = await axios.get(`http://localhost:3001/DB`);
    const respoundb = axiosResponse.data.map((recipe) => ({
      ...recipe,
      origin: "Database",
    }));
    const respoundOrder =  [...respound, ...respoundb]
    respoundOrder.sort((a, b) => {
      return a.nombre.toLocaleLowerCase() > b.nombre.toLocaleLowerCase() ? 1 : -1;
    });
    return dispatch({
      type: GET_RECIPE,
      payload: respoundOrder,
    });
  };
}

// Obtener recetas por ID

export function getRecipesById(recipeId) {
  return async (dispatch) => {
    var axiosRespond = await axios.get(
      `http://localhost:3001/recipesById/${recipeId}`
    );
    const recipe = axiosRespond.data;
    const repound = {
      ...recipe,
      diets: recipe.diets
        ? recipe.diets
        : recipe.Diets
        ? recipe.Diets.map((diet) => diet.nombre)
        : [],
    };
    return dispatch({
      type: GET_BY_ID,
      payload: repound,
    });
  };
}

// Obtener recetas por nombre

export function getRecipesByTitle(name) {
  return async (dispatch) => {
    var axiosRespond = await axios.get(
      `http://localhost:3001/recipesByName?name=${name}`
    );
    var respound = axiosRespond.data.validRecipes;
    return dispatch({
      type: GET_BY_TITLE,
      payload: respound,
    });
  };
}

// Obtener recetas por dieta

export function getRecipesByDiet() {
  return async (dispatch) => {
    var axiosRespond = await axios.get(`http://localhost:3001/recipesByDiets`);
    return dispatch({
      type: GET_DIET_TYPES,
      payload: axiosRespond.data,
    });
  };
}

//********** POST **********

// Añadir receta

export function addRecipe(payload) {
  return async (dispatch) => {
    try {
      const axiosResponse = await axios.post(
        `http://localhost:3001/createRecipes`,
        payload
      );

      return dispatch({
        type: ADD_RECIPE,
        payload: axiosResponse.data,
      });
    } catch (error) {
      throw error;
    }
  };
}

//********** FILTROS **********

// Filtrar por dietas

export function fltrByDiets(payload) {
  return {
    type: FILTER_BY_DIET,
    payload,
  };
}

// Filtrar por nombre

export function fltrByTitle(payload) {
  return {
    type: ORDER_BY_TITLE,
    payload,
  };
}

//Filtrar por puntuación de salud

export function fltrByPts(payload) {
  return {
    type: ORDER_BY_PTS,
    payload,
  };
}

// Filtrar por origen
// Obtenemos las recetas de la base de datos
export function fltrByOrigin(origin) {
  return async (dispatch, getState) => {
    if (origin !== "All") {
      // Filtro por Base de Datos
      const state = getState();
      const respound = state.recipes.filter(
        (recipe) => recipe.origin === origin
      );
      return dispatch({
        type: FILTER_BY_ORIGIN,
        payload: respound,
      });
    }
    // Filtro por ALL
    else {
      const state = getState();
      return dispatch({
        type: FILTER_BY_ORIGIN,
        payload: state.recipes,
      });
    }
  };
}
