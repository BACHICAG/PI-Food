import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  getRecipes,
  getRecipesByDiet,
  fltrByOrigin,
  fltrByPts,
  fltrByTitle,
  fltrByDiets,
} from "../../Redux/Actions/Actions.jsx";

import SearchBar from "../../Components/SearchBar/SearchBar.jsx"; // Importamos el componente SearchBar
import RecipeCard from "../../Components/RecipeCard/RecipeCard.jsx"; // Importamos el componente RecipeCard
import FilterBar from "../../Components/FilterBar/FilterBar.jsx"; // Importamos el componente FilterBar
import Pagination from "../../Components/Pagination/Pagination.jsx"; // Importamos el componente Pagination

import styles from "./HomePage.module.css";

export default function HomePage() {
  const recipes = useSelector((state) => state.allRecipes); // Obtenemos las recetas del estado
  const dietTypes = useSelector((state) => state.dietTypes); // Obtenemos las dietas del estado
  const [selectedDiet, setSelectedDiet] = useState("All");
  const [selectedOrigin, setSelectedOrigin] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1); // Agregamos el estado para la página actual
  const recipesPerPage = 9; // Número de recetas por página
  const dispatch = useDispatch();

  // Cuando el componente se monta, cargamos las recetas iniciales
  useEffect(() => {
    dispatch(getRecipesByDiet());
  }, []);

  useEffect(() => {
    if(dietTypes.length > 0){
      dispatch(getRecipes());
    }
    console.log(dietTypes);
  }, [dietTypes]);
  
  // useEffect(() => {
  //   dispatch(fltrByOrigin(selectedOrigin));
  // }, [selectedOrigin, recipes]);

  // Función para manejar el cambio en el filtro de dieta
  const handleDietChange = (event) => {
    setSelectedDiet(event.target.value);
    dispatch(fltrByDiets(event.target.value)); // Llamar a la acción fltrByDiets
  };

  // Función para manejar el cambio en el filtro de origen
  const handleOriginChange = (event) => {
    setSelectedOrigin(event.target.value);
    setCurrentPage(1);
    dispatch(fltrByOrigin(event.target.value)); // Llamar a la acción fltrByOrigin    
  };

  // Función para manejar el cambio en el orden
  const handleOrderChange = (order) => {
    setSelectedOrder(order);
    setSelectedOrder(order);
    if (order === "asc" || order === "desc") {
      dispatch(fltrByTitle(order)); // Llamar a la acción fltrByTitle
    } else if (order === "lowhigh" || order === "highlow") {
      dispatch(fltrByPts(order)); // Llamar a la acción fltrByPts
    }
  };

  // Función para cambiar la página actual
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Lógica para el paginado
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const paginatedRecipes = Array.isArray(recipes) ? recipes.slice(indexOfFirstRecipe, indexOfLastRecipe) : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Scrumptious Food!</h1>
      <SearchBar />
      {/* Agregamos el componente FilterBar */}
      <FilterBar
        selectedDiet={selectedDiet}
        handleDietChange={handleDietChange}
        selectedOrigin={selectedOrigin}
        handleOriginChange={handleOriginChange}
        selectedOrder={selectedOrder} // Pasamos el estado del orden
        handleOrderChange={handleOrderChange} // Pasamos la función para manejar el cambio de orden
        dietTypes={dietTypes} // Pasamos los tipos de dieta
      />
      <div className={styles.recipeContainer}>
        {paginatedRecipes.map((recipe) => (
          <Link to={`/recipes/${recipe.id}`} key={recipe.id} className={styles.recipeCard}>
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(recipes.length / recipesPerPage)}
        onPageChange={handlePageChange}
        className={styles.pagination}
      />
    </div>
  );
}
