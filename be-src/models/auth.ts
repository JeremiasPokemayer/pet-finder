import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";
import { Pet } from "./pet";

export class Auth extends Model {}
Auth.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "auth",
  }
);

// User.hasMany(Product);
