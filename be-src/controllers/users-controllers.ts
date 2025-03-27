import { User, Pet } from "../models";
import { cloudinary } from "../lib/cloudinary";
import { client } from "../lib/algolia";

export async function createUser(userData) {
  const { email, password } = userData;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return { success: false, message: "El usuario ya existe" };
    }

    const user = await User.create({
      email,
      password,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return { success: false, message: "Error al crear el usuario." };
  }
}

export async function authUser(userData) {
  const { email, password } = userData;
  try {
    const user = await User.findOne({
      where: { email, password },
    });
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return { success: false, message: "Error al obtener el usuario." };
  }
}

export async function getUser(userId) {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return { success: false, message: "Error al obtener el usuario." };
  }
}

export async function updatePassword(password, email, userId) {
  try {
    const user: any = await User.findOne({
      where: { email },
    });
    const updateData = {
      fullName: user.fullName,
      email: user.email,
      location: user.location,
      lat: user.lat,
      lng: user.lng,
      password: password,
    };
    await User.update(updateData, {
      where: {
        id: userId,
      },
    });
    console.log(updateData);
    return updateData;
  } catch (error) {
    console.error("Error al modificar la contraseña", error);
    return { success: false, message: "Error al modificar la contraseña" };
  }
}
export async function updateNameAndLocation(
  fullName,
  email,
  userId,
  location,
  userLat,
  userLng
) {
  try {
    const updateData = {
      fullName: fullName,
      email: email,
      location: location,
      lat: userLat,
      lng: userLng,
    };
    await User.update(updateData, {
      where: {
        id: userId,
      },
    });
    console.log(updateData);
    return updateData;
  } catch (error) {
    console.error("Error al modificar la contraseña", error);
    return { success: false, message: "Error al modificar la contraseña" };
  }
}
