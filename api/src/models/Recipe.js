const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      resumen_plato: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      health_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paso_a_paso: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
