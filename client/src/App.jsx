import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// Páginas de navegación (Pages)
import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import DetailPage from "./Pages/DetailPage/DetailPage.jsx";
import FormPage from "./Pages/FormPage/FormPage.jsx";
import Error from "./Pages/Error/Error.jsx";
// Estilos
import style from "./App.module.css";
// Sonido
import sound from "./Images/sound.mp3";

function App() {
  const [audio] = useState(new Audio(sound));
  const location = useLocation();

  // Colocar la canción al montar App, es decir, el componente
  useEffect(() => {
    audio.loop = true; // Repetir la canción cuando termine
    audio.volume = 0.015; // Nivel del Volumen
    audio.play(); // Iniciar la reproducción

    return () => {
      audio.pause(); // Pausar la reproducción al desmontar el componente
    };
  }, [audio]);

  const isDetailPage = location.pathname.startsWith("/recipes/");

  return (
    <div className={style.App}>
      
      {/* Que la imagen (textura) se aparezca en todas excepto en "/","/about" y "*" */}
      {(location.pathname !== '/' && location.pathname !== '/create' && location.pathname !== '*') && (
        <div className={style.imgContainer}>
          <div className={style.imagen}></div>
        </div>
      )}
      {(location.pathname !== '/' && location.pathname !== '/home' && !isDetailPage && location.pathname !== '*') && (
        <div className={style.imgContainer}>
          <div className={style.imagen2}></div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipes/:recipeId" element={<DetailPage />} />
        <Route path="/create" element={<FormPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
