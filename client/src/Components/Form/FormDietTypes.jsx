import React from "react";
import styles from "./FormDietTypes.module.css";

export default function FormDietTypes({
  dietTypes,
  selectedDiets,
  handleDietChange,
  error,
}) {
  console.log("Form Diet Types: ", dietTypes);
  return (
    <div className={styles.dietTypesContainer}>
      <label className={styles.label}>Diet Types:</label>
      <div className={styles.checkboxContainer}>
        {dietTypes && dietTypes.map((diet) => (
          <label key={diet.nombre} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={diet.nombre}
              checked={selectedDiets.includes(diet.nombre)}
              onChange={handleDietChange}
            />
            {diet.nombre}
          </label>
        ))}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
