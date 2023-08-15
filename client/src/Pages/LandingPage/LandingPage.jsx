import React from "react";
import style from "./LandingPage.module.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className={style.container}>
      <div className={style.backgroundImage}></div>
      <div className={style.content}>
        <h1 className={style.h1}>SCRUMPTIOUS FOOD</h1>
        <Link to="/home" aria-label="Start" className={style.link}>Start</Link>
      </div>
    </div>
  );
}