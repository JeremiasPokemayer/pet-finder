import { User, Pet, Report, Auth } from "../be-src/models/index";
import * as dotenv from "dotenv";
dotenv.config();
import mapboxgl from "mapbox-gl";

const API_BASE_URL = process.env.API_BASE_URL;
mapboxgl.accessToken = process.env.MAP_BOX_TOKEN;

const state = {
  data: {
    user: {
      userId: "",
      fullName: "",
      email: "",
      location: "",
      userLat: "",
      userLng: "",
      password: "",
    },
    pet: {
      petId: "",
      petName: "",
      petLocation: "",
      petLat: "",
      petLng: "",
      status: "",
      imageUrl: "",
    },
    pets: [],
    petIndex: "",
    updatePassword: "",
    imageUrl: "",
    token: "",
    reportEmail: "",
    reportName: "",
    reportPhone: "",
    reportWhere: "",
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("appState", JSON.stringify(newState));
    console.log("El state ha cambiado");
  },
  async authToken() {
    const cs = this.getState();
    const { email, password } = cs.user;
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Token no obtenido");
    }

    const data = await response.json();
    cs.token = data.token;
    this.setState(cs);
  },
  async setNameAndLocality(fullName, location) {
    const cs = this.getState();
    cs.user.fullName = fullName;
    cs.user.location = location;
    console.log(cs);
    this.setState(cs);
  },
  async signIn() {
    const cs = this.getState();
    const token = cs.token;
    const { email, password } = cs.user;
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Usuario no encontrado, ¡Registrate!");
    }

    const data = await response.json();
    cs.user.fullName = data.user.fullName;
    cs.user.userId = data.user.id;
    cs.user.location = data.user.location;
    cs.user.userLat = data.user.lat;
    cs.user.userLng = data.user.lng;
    console.log(data);
    this.setState(cs);
  },
  async signUp() {
    const cs = this.getState();
    const { email, password } = cs.user;
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw alert("Usuario existente, ¡Logueate!");
    }

    const data = await response.json();
    console.log(data);
    this.setState(cs);
  },
  async updatePassword() {
    const cs = this.getState();
    const response = await fetch(`${API_BASE_URL}/update-password`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password: cs.updatePassword,
        userId: cs.user.userId,
        email: cs.user.email,
      }),
    });
    const data = await response.json();
    console.log(cs);
    console.log(data);
    this.setState(cs);
  },
  async updateNameAndLocation() {
    const cs = this.getState();
    const response = await fetch(`${API_BASE_URL}/update-name`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: cs.user.fullName,
        userId: cs.user.userId,
        email: cs.user.email,
        location: cs.user.location,
        userLat: cs.user.userLat,
        userLng: cs.user.userLng,
      }),
    });
    const data = await response.json();
    console.log(data);
    this.setState(cs);
  },
  async setPet(dataPet) {
    const cs = state.getState();
    cs.pet.petName = dataPet.petName;
    cs.pet.petLocation = dataPet.petLocation;
    cs.pet.status = dataPet.status;
    state.setState(cs);
    const response = await fetch(`${API_BASE_URL}/setpets`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: cs.pet.petName,
        location: cs.pet.petLocation,
        status: "Perdido",
        petLat: Number(cs.pet.petLat),
        petLng: Number(cs.pet.petLng),
        imageUrlData: cs.pet.imageUrl,
        userId: cs.user.userId,
      }),
    });
    const data = response.json();
    console.log(data);
    this.setState(cs);
  },
  async getPets() {
    const cs = this.getState();
    const { userLat, userLng } = cs.user;
    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);
    const response = await fetch(
      `${API_BASE_URL}/pets-cerca-de?lat=${lat}&lng=${lng}`
    );
    const dataPets = await response.json();
    const existingPetIds = new Set(cs.pets.map((pet) => pet.petId));
    for (const pet of dataPets) {
      if (!existingPetIds.has(pet.petId)) {
        cs.pets.push(pet);
      }
    }
  },
  async getPetsById() {
    const cs = this.getState();
    const { userId } = cs.user;
    const response = await fetch(`${API_BASE_URL}/mispets`, {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });
    const dataPets = await response.json();
    const existingPetIds = new Set(cs.pets.map((pet) => pet.petId));
    for (const pet of dataPets) {
      if (!existingPetIds.has(pet.petId)) {
        cs.pets.push(pet);
      }
    }
    this.setState(cs);
  },
  async updatePet(updateDataPets) {
    const cs = this.getState();
    const {
      objectID,
      fullName,
      petLat,
      petLng,
      location,
      imageUrlData,
      userId,
    } = updateDataPets;
    const res = await fetch(`${API_BASE_URL}/update-pet`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        objectID,
        fullName,
        location,
        petLat,
        petLng,
        imageUrlData,
        userId,
      }),
    });
    this.setState(cs);
    return res;
  },
  async deletePet(objectID) {
    const cs = this.getState();
    const response = await fetch(`${API_BASE_URL}/pet/${objectID}`, {
      method: "delete",
    });
    this.setState(cs);
  },
  async petFind(objectID) {
    const cs = this.getState();
    const res = await fetch(`${API_BASE_URL}/petfind`, {
      method: "patch",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        objectID,
      }),
    });
    this.setState(cs);
  },
  async setReport(objectID, userId) {
    const cs = this.getState();
    const { reportName, reportPhone } = state.data;
    const location = state.data.reportWhere;
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    const user = await response.json();
    const reportEmail = user.email;
    console.log(reportEmail);

    const res = await fetch(`${API_BASE_URL}/report`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        reportName,
        reportPhone,
        location,
        reportEmail,
        objectID,
      }),
    });
    this.setState(cs);
  },
};

(function loadState() {
  const storedState = localStorage.getItem("appState");
  if (storedState) {
    state.setState(JSON.parse(storedState));
  }
})();

export { state };
