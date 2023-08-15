import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux"; // Importar el selector para obtener una receta por ID
import { useParams, Link } from "react-router-dom";
import { getRecipesById } from "../../Redux/Actions/Actions.jsx";
import styles from "./DetailPage.module.css";
import imagen from "../../Images/Back.png";

export default function DetailPage(props) {
  // Obtener el ID de la receta desde los parámetros de la URL
  const { recipeId } = useParams();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detailRecipe, setDetailRecipe] = useState(null);

  useEffect(() => {
    // Obtener los detalles de la receta
    dispatch(getRecipesById(recipeId))
      .then((response) => {
        setDetailRecipe(response.payload); // Actualizar los detalles de la receta
        setLoading(false); // Cuando se completa la carga
      })
      .catch(() => {
        setError(true); // Si hay un error
        setLoading(false);
      });

    // Limpiar los detalles cuando el componente se desmonte
    return () => {
      setDetailRecipe(null);
    };
  }, [dispatch, recipeId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading recipe details</p>;
  }

  // Función para eliminar etiquetas HTML del texto
  const stripHtmlTags = (html) => {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  };

  // Eliminar etiquetas HTML y mostrar enlaces funcionales
  const sanitizedSummary = stripHtmlTags(detailRecipe.resumen_plato);

  return (
    <div className={styles.detailContainer}>
      {/* ---------- Renderizando los detalles de la receta ---------- */}

      {/* ---------- ID ---------- */}

      <h2>ID: {detailRecipe.id ? detailRecipe.id : "N/A"}</h2>

      {/* ---------- Name ---------- */}

      <h2>Name: {detailRecipe.nombre ? detailRecipe.nombre : "N/A"}</h2>

      {/* ---------- Image ---------- */}

      <img
        src={detailRecipe.imagen}
        alt={detailRecipe.nombre}
        className={styles.recipeImage}
      />

      {/* ---------- Health Score ---------- */}

      <p>
        Health Score:{" "}
        {detailRecipe.health_score ? detailRecipe.health_score : "N/A"}
      </p>

      {/* ---------- Diet Types ---------- */}

      <p>
        Diet Types: {detailRecipe.diets ? detailRecipe.diets.join(", ") : "N/A"}
      </p>

      {/* ---------- Summary ---------- */}

      <p className={styles.summary}>
        Summary: {sanitizedSummary ? sanitizedSummary : "N/A"}
      </p>

      {/* ---------- Steps ---------- */}

      <div className={styles.stepsContainer}>
        <p className={styles.step}>Steps:</p>
        <ul>
          {detailRecipe.paso_a_paso
            ? detailRecipe.paso_a_paso.map((step, index) => (
                <li key={index}>
                  <p>{`Step ${index + 1}: ${step}`}</p>
                </li>
              ))
            : "N/A"}
        </ul>
      </div>

      {/* ---------- Redireccionamiento a Home (Home Page) ---------- */}

      <Link to="/home" className={styles.backLink}>
        <img src={imagen} alt="Go Back" width="50" />
      </Link>
    </div>
  );
}
