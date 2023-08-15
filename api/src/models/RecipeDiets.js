// El archivo "RecipeDiets.js" es para definir la tabla de relaciones muchos a muchos entre recetas y tipos de dietas
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "RecipeDiets",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
