import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";
import { Pet } from "./pet";

export class User extends Model {}
User.init(
  {
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    location: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    password: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "user",
  }
);

// User.hasMany(Product);
