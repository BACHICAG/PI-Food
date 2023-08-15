import React from "react";
import styles from "./RecipeCard.module.css";

export default function RecipeCard({ recipe }) {
  return (
    <div className={styles.recipeCard}>
      <img src={recipe.imagen} alt={recipe.nombre} className={styles.recipeImage} />
      <h2 className={styles.recipeName}>{recipe.nombre}</h2>
      <p className={styles.dietTypes}>Diet Types: {recipe.diets ? recipe.diets.join(", ") : 'No diets available'}</p>
    </div>
  );
}
