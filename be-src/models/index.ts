import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";

User.hasMany(Pet);
User.hasMany(Auth);
Auth.belongsTo(User);
Pet.belongsTo(User);
Pet.hasMany(Report);

export { User, Pet, Report, Auth };
