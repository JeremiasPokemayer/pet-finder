import { client } from "../be-src/lib/algolia";
import { User } from "./models";
import {
  authUser,
  createUser,
  getUser,
  updatePassword,
  updateNameAndLocation,
} from "./controllers/users-controllers";
import {
  authSignup,
  authSignin,
  authMiddleware,
  getToken,
  updatePasswordHash,
} from "./controllers/auth-controllers";
import {
  getPetsUbication,
  setPetUbication,
  getPetsUbicationById,
  updatePetById,
  deletePet,
  petFind,
} from "./controllers/pets-controllers";
import { setReport } from "./controllers/report-controllers";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3002;
app.use(express.json());
app.use(cors());

// index.then((res) => console.log(res)).catch((err) => console.error(err));

// client
//   .searchSingleIndex({
//     indexName,
//     searchParams: {
//       aroundLatLng: "40.71 , -74.01",
//       aroundRadius: 1000000,
//     },
//   })
//   .then((res) => {
//     console.log(res);
//   });

app.post("/signup", async (req, res) => {
  const user = await createUser(req.body);
  if (user.success) {
    const auth = await authSignup(user.user.dataValues);
    res.json({ user, auth });
  } else {
    res.status(400).json({ error: user.message });
  }
});

app.post("/auth/token", async (req, res) => {
  const token = await getToken(req.body);
  res.json({ token });
});

app.post("/signin", async (req, res) => {
  const user = await authUser(req.body);
  res.json({ user });
});

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ error: "Error al obtener el perfil del usuario" });
  }
});

app.post("/update-password", async (req, res) => {
  const { userId, email, password } = req.body;
  const updateUser = await updatePassword(password, email, userId);
  await updatePasswordHash(updateUser);
  res.json(updateUser);
});

app.post("/update-name", async (req, res) => {
  const { userId, email, fullName, location, userLat, userLng } = req.body;
  const updateUser = await updateNameAndLocation(
    fullName,
    email,
    userId,
    location,
    userLat,
    userLng
  );
  res.json(updateUser);
});

app.post("/update-name", async (req, res) => {
  const { userId, email, fullName, location, userLat, userLng } = req.body;
  const updateUser = await updateNameAndLocation(
    fullName,
    email,
    userId,
    location,
    userLat,
    userLng
  );
  res.json(updateUser);
});

app.post("/setpets", async (req, res) => {
  const pet = req.body;
  const response: any = await setPetUbication(pet);
  res.json(response);
});

app.get("/pets-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  const response: any = await getPetsUbication(lat, lng);
  res.json(response.hits);
});

app.put("/mispets", async (req, res) => {
  const { userId } = req.body;
  const response: any = await getPetsUbicationById(userId);
  res.json(response);
});

app.post("/update-pet", async (req, res) => {
  const { objectID } = req.body;
  const updatePet = await updatePetById(objectID, req.body);
  res.json(updatePet);
});

app.post("/report", async (req, res) => {
  const { reportName, reportPhone, location, reportEmail, objectID } = req.body;
  const dataReport = {
    reportName,
    reportPhone,
    location,
    reportEmail,
  };
  const report = await setReport(dataReport, objectID);
  res.json(report);
});

app.delete("/pet/:petId", async (req, res) => {
  const { petId } = req.params;
  const petDestroy = await deletePet(petId);
  res.json(petDestroy);
});

app.patch("/petfind", async (req, res) => {
  const { objectID } = req.body;
  const petFinded = await petFind(objectID);
  res.json(petFinded);
});

app.listen(port, () => {
  console.log(`App creada en el puerto: ${port}`);
});
