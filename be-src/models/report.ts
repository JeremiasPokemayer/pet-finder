import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Report extends Model {}
Report.init(
  {
    petId: DataTypes.INTEGER,
    reportName: DataTypes.STRING,
    reportPhone: DataTypes.STRING,
    location: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "report",
  }
);
