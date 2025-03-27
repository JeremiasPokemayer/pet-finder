import { error } from "console";
import { User } from "../models/user";
import { Auth } from "../models/auth";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

const SECRET = process.env.PASSWORD_SECRET;

export async function authSignup(user) {
  const { password, email, id } = user;
  try {
    const [auth, authCreated] = await Auth.findOrCreate({
      where: { userId: id },
      defaults: {
        email,
        password: getSHA256ofString(password),
        user_id: id,
      },
    });
    return auth;
  } catch (error) {
    console.error("Error en signup: ", error);
    throw new Error("Error al crear el usuario");
  }
}

export async function authSignin(user) {
  const { password, email } = user;
  const passwordHasheado = getSHA256ofString(password);
  const auth = await Auth.findOne({
    where: { email, password: passwordHasheado },
  });

  if (!auth) {
    console.error("Email o contraseña incorrectos");
    throw new Error("Email o contraseña incorrectos");
  }
}

export async function getToken(data) {
  const { password, email } = data;
  const passwordHasheado = getSHA256ofString(password);
  const auth = await Auth.findOne({
    where: { email, password: passwordHasheado },
  });

  if (!auth) {
    console.error("Email o contraseña incorrectos");
    throw new Error("Email o contraseña incorrectos");
  }

  const token = jwt.sign({ id: auth.get("id") }, SECRET);
  return token;
}

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch (e) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export async function updatePasswordHash(userData) {
  try {
    const { password, email } = userData;
    const passwordHasheado = getSHA256ofString(password);
    const auth: any = await Auth.findOne({
      where: { email },
    });
    const authUpdateData = {
      email: email,
      password: passwordHasheado,
      userId: auth.userId,
    };
    await Auth.update(authUpdateData, {
      where: {
        userId: authUpdateData.userId,
      },
    });
    return authUpdateData;
  } catch (error) {
    console.error("Error al modificar la contraseña hasheada", error);
    return {
      success: false,
      message: "Error al modificar la contraseña hasheada",
    };
  }
}
