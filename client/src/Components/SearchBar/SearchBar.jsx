import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { getRecipesByTitle } from "../../Redux/Actions/Actions.jsx";

import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para almacenar el término de búsqueda
  const dispatch = useDispatch(); // Utilizamos useDispatch para despachar la acción de búsqueda

  // Manejador de cambios en el input de búsqueda
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Manejador de envío del formulario de búsqueda
  const handleSubmit = (event) => {
    event.preventDefault();
    // Si hay un término de búsqueda válido, despachamos la acción
    if (searchTerm.trim() !== "") {
      dispatch(getRecipesByTitle(searchTerm));
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search recipes by name..."
          value={searchTerm}
          onChange={handleInputChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton} >Search</button>
      </form>
    </div>
  );
}
