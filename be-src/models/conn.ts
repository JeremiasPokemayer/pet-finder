import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  "postgresql://neondb_owner:npg_DNEj1OGdHL8y@ep-still-flower-a8r8r333-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
);

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

// try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
