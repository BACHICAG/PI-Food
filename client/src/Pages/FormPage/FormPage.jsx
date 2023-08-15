import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { addRecipe, getRecipesByDiet } from "../../Redux/Actions/Actions.jsx";
import FormField from "../../Components/Form/FormField.jsx";
import FormDietTypes from "../../Components/Form/FormDietTypes.jsx";

import styles from "./FormPage.module.css";
import imagen from "../../Images/Back.png";

export default function FormPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    resumen_plato: "",
    health_score: "",
    paso_a_paso: [],
    selectedImageType: "url",
    imageUrl: "",
    imageFile: null,
    selectedDiets: [],
  });

  // Lo que se va a enviar
  const postData = {
    nombre: formData.nombre,
    imagen:
      formData.selectedImageType === "url"
        ? formData.imageUrl
        : formData.imageFile, // Asegúrate de que estás enviando la imagen correctamente
    resumen_plato: formData.resumen_plato,
    health_score: formData.health_score,
    paso_a_paso: formData.paso_a_paso.map((step) => String(step)),
    diets: formData.selectedDiets,
  };

  // Mensaje cuando se añade con éxito una receta
  const [recipeAdded, setRecipeAdded] = useState(false);

  // Estado para la opción de imagen
  const [imageOption, setImageOption] = useState("url");

  const dispatch = useDispatch();
  // Obteniendo los tipos de dietas
  const [dietTypes, setDietTypes] = useState(null);

  useEffect(() => {
    // Obtener los detalles de la receta
    dispatch(getRecipesByDiet())
      .then((response) => {
        // Actualizar el estado con las dietas
        setDietTypes(response.payload);
      })
      .catch(() => {
        throw new Error("Diets could not be obtained.");
      });

    // Limpiar los detalles cuando el componente se desmonte
    return () => {
      setDietTypes(null);
    };
  }, [dispatch]);

  const [errors, setErrors] = useState({
    nombre: "",
    resumen_plato: "",
    healthScore: "",
    steps: [],
    imageUrl: "",
  });

  // ---------------- Funciones para manejar cambios en los campos ----------------

  // Función para manejar cambios en el nombre de la receta
  const handleNameChange = (event) => {
    // Actualizar el estado de formData
    const value = event.target.value;
    setFormData({ ...formData, nombre: value });
    setErrors({
      ...errors,
      nombre: value ? "" : "The recipe must have a name.",
    });
  };

  // ---------------------------------------------------------------------

  // Función para manejar cambios en el resumen de la receta
  const handleSummaryChange = (event) => {
    // Actualizar el estado de formData
    const value = event.target.value;
    setFormData({ ...formData, resumen_plato: value });
    setErrors({
      ...errors,
      resumen_plato: value ? "" : "The summary is required.",
    });
  };

  // ---------------------------------------------------------------------

  const handleHealthScoreChange = (event) => {
    const value = event.target.value;
    // Verificar que el valor esté entre 0 y 100
    const sanitizedValue = Math.max(0, Math.min(100, value));
    setFormData({ ...formData, health_score: sanitizedValue });
    setErrors({
      ...errors,
      health_score: sanitizedValue !== "" ? "" : "Health score is required.",
    });
  };

  // ---------------------------------------------------------------------

  // Función para manejar cambios en los tipos de dieta seleccionados
  const handleDietChange = (event) => {
    const dietValue = event.target.value;
    const updatedSelectedDiets = formData.selectedDiets.includes(dietValue)
      ? formData.selectedDiets.filter((diet) => diet !== dietValue)
      : [...formData.selectedDiets, dietValue];

    setFormData({
      ...formData,
      selectedDiets: updatedSelectedDiets,
    });
    // setErrors({
    //   ...errors,
    //   selectedDiets: updatedSelectedDiets !== "" ? "" : "Diets Types is required.",
    // });
  };

  // **************** Funciones para manejar los cambios en la imagen ****************

  // Función para manejar el cambio de opción de imagen
  const handleImageOptionChange = (option) => {
    setImageOption(option);
    setFormData({
      ...formData,
      selectedImageType: option,
      // Reiniciar el campo de imagen al cambiar la opción
      imageUrl: "",
      imageFile: null,
    });
  };

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

  // Función para actualizar el estado del formulario con el archivo de imagen cargado
  // y limpia el campo de la URL de la imagen si se ha seleccionado una imagen para cargar.

  const handleImageUpload = (event) => {
    const value = event.target.value;
    if (imageOption === "url") {
      setFormData({
        ...formData,
        imageFile: null,
        imageUrl: value,
        selectedImageType: "url",
      });
      setErrors({
        ...errors,
        imageUrl: value === "" ? "Image is required." : "",
      });
    } else {
      setFormData({
        ...formData,
        imageFile: event,
        imageUrl: "",
        selectedImageType: "upload",
      });
    }
  };

  // **************** Funciones para manejar los cambios en los steps ****************

  // Función para manejar la adición de un nuevo paso
  const handleAddStep = () => {
    setFormData({
      ...formData,
      paso_a_paso: [...formData.paso_a_paso, ""], // Agrega una cadena vacía como nuevo paso
    });
  };

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

  // Función para manejar cambios en los steps
  const handleStepContentChange = (index, content) => {
    const updatedSteps = formData.paso_a_paso.map((step, i) =>
      i === index ? content : step
    );
    setFormData({ ...formData, paso_a_paso: updatedSteps });
  };

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

  // Función para eliminar un paso
  const handleRemoveStep = (index) => {
    const updatedSteps = formData.paso_a_paso.filter((_, i) => i !== index);
    setFormData({ ...formData, paso_a_paso: updatedSteps });
  };

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

  // Función para verificar si un paso es válido
  const isStepValid = (step) => {
    return step !== undefined && step !== null && step.trim() !== "";
  };

  // **************** Funciones de validación ****************

  // Función para verificar si el formulario es válido

  const isFormValid = () => {
    // Verificar que todos los campos estén llenos y válidos

    const areStepsValid =
      formData.paso_a_paso.length > 0 &&
      formData.paso_a_paso.every((step) => step.trim() !== "");

    return (
      formData.nombre.trim() !== "" &&
      formData.resumen_plato.trim() !== "" &&
      formData.health_score !== "" &&
      formData.selectedDiets.length > 0 &&
      areStepsValid &&
      ((formData.selectedImageType === "url" &&
        formData.imageUrl.trim() !== "") ||
        (formData.selectedImageType === "upload" &&
          (formData.imageFile !== undefined || formData.imageFile !== null)))
    );
  };

  // ---------------------------------------------------------------------

  // Función para enviar o crear la receta
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validar si los campos son válidos
    if (isFormValid()) {
      try {
        // Enviar la receta a la acción addRecipe
        const response = dispatch(addRecipe(postData));
        // Limpiar el formulario y los errores si la receta se agregó con éxito
        if (response.success) {
          setRecipeAdded(true);
          setFormData({
            ...formData,
            nombre: "",
            resumen_plato: "",
            health_score: "",
            paso_a_paso: [],
            selectedImageType: "url",
            imageUrl: "",
            selectedDiets: [],
          });
          setErrors({});
        }
        // Aquí podrías mostrar algún mensaje de éxito si lo deseas
        console.log("Recipe added");
      } catch (error) {
        // Manejar errores en caso de que falle la solicitud
        console.error("Error adding recipe:", error);
      }
    } else {
      // Mostrar mensajes de error si los campos son inválidos
      setErrors({
        nombre:
          formData.nombre.trim() === "" ? "The recipe must have a name." : "",

        resumen_plato:
          formData.resumen_plato.trim() === ""
            ? "The summary is required."
            : "",

        healthScore:
          formData.health_score === "" ? "Health score is required." : "",

        imageUrl:
          (formData.selectedImageType === "url" &&
            formData.imageUrl.trim() === "") ||
          (formData.selectedImageType === "upload" &&
            (formData.imageFile === undefined || formData.imageFile === null))
            ? "Image is required."
            : "",

        steps: formData.paso_a_paso.map((step, index) =>
          !isStepValid(step) ? `Step ${index + 1} is required.` : ""
        ),
      });
    }
  };

  return (
    <div>
      <h2 className={styles.h3}>Create a New Recipe</h2>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* ---------------- Campo de Nombre ---------------- */}

        <FormField
          label="Name"
          type="text"
          value={formData.nombre}
          onChange={handleNameChange}
          placeholder="Write the name of your recipe"
          error={errors.nombre}
        />

        <div className={styles.linea}></div>

        {/* ---------------- Campo de Resumen ---------------- */}

        <FormField
          label="Summary"
          type="textarea"
          value={formData.resumen_plato}
          onChange={handleSummaryChange}
          placeholder="Write the summary of your recipe"
          error={errors.resumen_plato}
        />

        <div className={styles.linea}></div>

        {/* ---------------- Campo de Nivel de Comida Saludable ---------------- */}

        <FormField
          label="Health Score"
          type="number"
          value={formData.health_score}
          onChange={handleHealthScoreChange}
          placeholder="Enter health score"
          error={errors.health_score}
        />

        {/* ---------------- Campos de Tipo de Dieta ---------------- */}

        <FormDietTypes
          dietTypes={dietTypes}
          selectedDiets={formData.selectedDiets}
          handleDietChange={handleDietChange}
          error={errors.selectedDiets}
        />

        <div className={styles.linea}></div>

        {/* ---------------- Campo de Opción de Imagen ---------------- */}

        {/*
          Proporcionar al usuario dos opciones para agregar una imagen a la receta:
          mediante una URL o cargando un archivo.
        */}

        <div className={styles.imageOptionContainer}>
          <h3 className={styles.h3_2}>Image:</h3>
          <div className={styles.optionContainer}>
            <label className={styles.optionLabel}>Options:</label>
          </div>

          <div className={styles.imageOptions}>
            {/* Agregar una imagen mediante una URL */}

            <label>
              <input
                type="radio"
                value="url"
                checked={imageOption === "url"}
                onChange={() => handleImageOptionChange("url")}
              />
              URL
            </label>

            {/* Agregar una imagen cargando un archivo. */}

            <label>
              <input
                type="radio"
                value="upload"
                checked={imageOption === "upload"}
                onChange={() => handleImageOptionChange("upload")}
              />
              Upload
            </label>
          </div>
        </div>

        {/* ---------------- Campos de URL de Imagen y Subir Imagen ---------------- */}

        <div className={styles.imageField}>
          {imageOption === "url" && (
            <div className={styles.link}>
              <input
                type="text"
                value={formData.imageUrl}
                placeholder="Enter image URL"
                onChange={(event) =>
                  setFormData({ ...formData, imageUrl: event.target.value })
                }
                className={styles.url}
              />
              {errors.imageUrl && (
                <p className={styles.errorMessage}>{errors.imageUrl}</p>
              )}
            </div>
          )}

          {imageOption === "upload" && (
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(event.target.files[0])}
              className={styles.url}
            />
          )}
        </div>

        <div className={styles.linea}></div>

        {/* ---------------- Campos para los Pasos ---------------- */}

        <div className={styles.stepsSection}>
          {/* Título de los pasos */}
          <h3 className={styles.stepTitle}>Steps:</h3>

          <ul className={styles.stepList}>
            {formData.paso_a_paso.map((step, index) => (
              <li key={index} className={styles.stepItem}>
                {/* Titulo de cada paso */}
                <span className={styles.stepNumber}>Step {index + 1}:</span>

                <div className={styles.stepContent}>
                  {/* Campo para escribir el contenido del paso */}
                  <textarea
                    value={step}
                    placeholder={`Write description for step ${index + 1}`}
                    onChange={(e) =>
                      handleStepContentChange(index, e.target.value)
                    }
                    className={
                      !isStepValid(step) ? styles.invalid : styles.stepTextarea
                    }
                  />
                  {/* Mostrar mensaje de error específico para el paso */}
                  {errors.steps && errors.steps[index] && (
                    <p className={styles.errorMessage}>{errors.steps[index]}</p>
                  )}
                </div>

                {/* Agregar el botón "Eliminar paso" */}

                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className={styles.removeStepButton}
                >
                  Remove Step
                </button>
              </li>
            ))}
          </ul>

          {/*  ---------------- Botón para añadir paso ---------------- */}

          <button
            type="button"
            onClick={handleAddStep}
            className={styles.addStepButton}
          >
            Add Step
          </button>
        </div>

        {/*  ---------------- Botón para Crear Receta ---------------- */}

        <button
          type="submit"
          className={`${
            !isFormValid() ? styles.invalidButton : styles.createButton
          }`}
          // Desactivar si el formulario no es válido
          disabled={!isFormValid()}
        >
          Create Recipe
        </button>

        {/* ---------- Redireccionamiento a Home (Home Page) ---------- */}

        <Link to="/home" className={styles.backLink}>
          <img src={imagen} alt="Go Back" width="50" />
        </Link>

        {/* Mensaje de éxito */}

        {recipeAdded && (
          <p className={styles.successMessage}>Recipe added successfully!</p>
        )}
      </form>
    </div>
  );
}
