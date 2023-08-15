//Importación del servidor
const server = require("./src/app.js");
//Importación de la conexión a la base de datos 
const { conn } = require("./src/db.js");
//Importación de la funcion "getDiets" para pre-cargar las dietas a la BD
const { getDiets } = require("./src/Controllers/getDiets.js");
// Importación del módulo "dotenv" para cargar las variables de entorno
require("dotenv").config();
const { PORT } = process.env;

// Sincronización de todos los modelos y arranque del servidor
conn.sync({ force: true }).then(() => {
  server.listen(PORT, () => {
    // getDiets();
    console.log('Server & DDBB Running ✅');
  });
});
