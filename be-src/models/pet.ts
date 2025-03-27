import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";
import { User } from "./user";

export class Pet extends Model {}
Pet.init(
  {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    location: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    reportedId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "pet",
  }
);

// Product.belongsTo(User);
