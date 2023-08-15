import React from "react";
import { Link } from "react-router-dom";
import styles from "./FilterBar.module.css";

export default function FilterBar({
  selectedDiet,
  handleDietChange,
  selectedOrigin,
  handleOriginChange,
  selectedOrder,
  handleOrderChange,
  dietTypes,
}) {
  return (
    <div className={styles.filterContainer}>
      {/* ---------- Filtro por dieta ---------- */}

      <div className={styles.dietFilter}>
        <label>Filter by Diet:</label>
        <select
          className={styles.select}
          value={selectedDiet}
          onChange={handleDietChange}
        >
          <option value="All" key="all1">
            All
          </option>
          {dietTypes.map((diet) => (
            <option value={diet.nombre} key={diet.id}>
              {diet.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- Filtro por origen ---------- */}

      <div className={styles.originFilter}>
        <label>Filter by Origin:</label>
        <select
          className={styles.select}
          value={selectedOrigin}
          onChange={handleOriginChange}
        >
          <option value="All" key="all2">
            All
          </option>
          <option value="API" key="api">
            API
          </option>
          <option value="Database" key="database">
            Database
          </option>
        </select>
      </div>

      {/* ---------- Filtro por orden ---------- */}

      <div className={styles.orderFilter}>
        <label>Order by:</label>
        <select
          value={selectedOrder}
          onChange={(event) => handleOrderChange(event.target.value)}
          className={styles.select}
        >
          <option value="asc" key="asc">
            Title Ascending
          </option>
          <option value="desc" key="desc">
            Title Descending
          </option>
          <option value="lowhigh" key="lowhigh">
            Health Score Low to High
          </option>
          <option value="highlow" key="highlow">
            Health Score High to Low
          </option>
        </select>
      </div>

      {/* Botón para ir a Create */}

      <Link to="/create" className={styles.createButton}>
        Create Recipe
      </Link>
    </div>
  );
}
