import mapboxgl from "mapbox-gl";
import { client } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";
import { Pet } from "../models/pet";

mapboxgl.accessToken = process.env.MAP_BOX_TOKEN;

export async function getPetsUbication(userLat, userLng) {
  const indexName = "mascotas";
  const response = await client.searchSingleIndex({
    indexName,
    searchParams: {
      aroundLatLng: `${userLat},${userLng}`,
      aroundRadius: 10000000,
    },
  });
  return response;
}

export async function getPetsUbicationById(userId) {
  const indexName = "mascotas";
  const response = await client.searchSingleIndex({
    indexName,
    searchParams: {
      filters: `reportId=${userId}`,
    },
  });
  return response.hits;
}

export async function deletePet(objectID) {
  const indexName = "mascotas";
  const response = await client.deleteObject({ indexName, objectID });

  const petById = await Pet.findByPk(objectID);
  const petDelete = await petById.destroy();

  return petDelete;
}

export async function petFind(objectID) {
  const indexName = "mascotas";
  const updatePet = {
    status: "Encontrado",
  };
  const updatedPet = await Pet.update(updatePet, {
    where: {
      id: objectID,
    },
  });

  const index = await client.saveObject({
    indexName,
    body: {
      objectID: objectID,
      status: "Encontrado",
    },
  });

  deletePet(objectID);
}

export async function updatePetById(objectID, petsData) {
  const { fullName, location, petLat, petLng, imageUrlData, userId } = petsData;
  const imagen = await cloudinary.uploader.upload(imageUrlData, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });
  const indexName = "mascotas";
  const updatePet = {
    location: location,
    name: fullName,
    _geoloc: {
      lat: petLat,
      lng: petLng,
    },
    imageUrl: imagen.secure_url,
  };
  const updatedPet = await Pet.update(updatePet, {
    where: {
      id: objectID,
    },
  });

  const index = await client.saveObject({
    indexName,
    body: {
      objectID: objectID,
      location: location,
      fullName: fullName,
      status: "Perdido",
      _geoloc: {
        lat: petLat,
        lng: petLng,
      },
      imageUrl: imagen.secure_url,
      reportId: userId,
    },
  });
  return;
}

export async function setPetUbication(petsData) {
  const { fullName, location, petLat, petLng, imageUrlData, userId } = petsData;

  const imagen = await cloudinary.uploader.upload(imageUrlData, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });
  const indexName = "mascotas";

  const newPet = await Pet.create({
    location: location,
    name: fullName,
    status: "Perdido",
    _geoloc: {
      lat: petLat,
      lng: petLng,
    },
    imageUrl: imagen.secure_url,
    reportedId: userId,
  });

  const index = await client.saveObject({
    indexName,
    body: {
      objectID: newPet.get("id"),
      location: location,
      fullName: fullName,
      status: "Perdido",
      _geoloc: {
        lat: petLat,
        lng: petLng,
      },
      imageUrl: imagen.secure_url,
      reportId: userId,
    },
  });
  return index;
}
