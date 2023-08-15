// Estableciendo conexión con la Base de Datos
require('./db.js');

// ----- Express -----
const express = require('express');
// Creamos el servidor y le colocamos el nombre de "API"
const server = express();
server.name = 'API';

// Importando Middlewars
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Routers
const createRecipes = require('./routes/createRecipes.js');
const recipes = require("./routes/recipes.js");
const recipeById = require('./routes/recipeById.js');
const recipeByName = require('./routes/recipesByName.js');
const recipeByDiets = require('./routes/recipeByDiets.js');
const recipesByDB = require("./routes/recipesByDB.js");

// Middlewars
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(express.json());
server.use(morgan('dev'));

// Cors
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  // Configuración de la cookie con SameSite y Secure
  res.header('Set-Cookie', 'authToken=authToken-value; SameSite=Lax;');

  next();
});

//Rutas
server.use('/recipes', recipes);
server.use('/recipesById', recipeById);
server.use('/recipesByName', recipeByName);
server.use('/recipesByDiets', recipeByDiets);
server.use('/createRecipes', createRecipes);
server.use('/DB', recipesByDB);


// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
