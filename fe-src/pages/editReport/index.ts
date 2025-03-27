import { Router } from "@vaadin/router";
import { state } from "../../state";
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

class EditReport extends HTMLElement {
  connectedCallback() {
    this.render();
    this.dataInput();
    const map = this.initMap();

    const searchInput: any = this.querySelector("input[name='q']");
    const search = new MapboxGeocoder({
      accessToken: process.env.MAP_BOX_TOKEN,
      mapboxgl: mapboxgl,
      container: searchInput,
    });

    map.addControl(search);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        console.log(searchInput.value);
        e.preventDefault();
        search.query(searchInput.value);
      }
    });
    search.on("result", (e) => {
      const { place_name } = e.result;
      searchInput.value = place_name;
      const [lng, lat] = e.result.center;

      map.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true,
      });
    });

    const { userLat, userLng } = state.data.user;
    const lat = userLat ? Number(userLat) : -34.6037;
    const lng = userLng ? Number(userLng) : -58.3816;

    const marker = new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat([lng, lat])
      .addTo(map);

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      state.data.pet.petLat = lat.toString();
      state.data.pet.petLng = lng.toString();
      map.flyTo({
        center: [lng, lat],
        zoom: 20,
      });
      marker.setLngLat([lng, lat]);
    });

    const botonDelete = this.querySelector(".button_red");
    botonDelete.addEventListener("click", (e) => {
      e.preventDefault();
      const indexPet = state.data.petIndex;
      const { objectID } = state.data.pets[indexPet];
      state.deletePet(objectID);
    });

    const botonFind = this.querySelector(".button_green");
    botonFind.addEventListener("click", (e) => {
      e.preventDefault();
      const indexPet = state.data.petIndex;
      const { objectID } = state.data.pets[indexPet];
      state.petFind(objectID);
    });

    const botonSave = this.querySelector(".button_blue");
    botonSave.addEventListener("click", (e) => {
      e.preventDefault();
      const formName = this.querySelector(".form_name");
      const formLocation = this.querySelector(".search-form");
      const inputName = formName.querySelector('input[name="name"]') as any;
      const inputLocation = formLocation.querySelector(
        'input[name="q"]'
      ) as any;
      const indexPet = state.data.petIndex;
      const { objectID } = state.data.pets[indexPet];

      const dataPet = {
        objectID: objectID,
        fullName: inputName.value,
        location: inputLocation.value,
        petLat: Number(state.data.pet.petLat),
        petLng: Number(state.data.pet.petLng),
        imageUrlData: state.data.pet.imageUrl,
        userId: state.data.user.userId,
      };
      state.updatePet(dataPet);
      console.log(state.data);
    });
  }
  async render() {
    const style = document.createElement("style");
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title">Editar reporte de mascota</h3>
        <form class="form_name">
          <label>
              <h3>NOMBRE</h3>
              <input type="name" name="name" class="input" id="input_name">
          </label>
        </form>
        <div class="container_dropzone">
          <div class="profile-picture-container"></div>
          <custom-button attributeText="Modificar Foto" class="button_blue2" id="agregarImageBtn"></custom-button>
        </div>
        <div class="map_container">
          <div id="map" style="width: 310px; height: 310px;"></div>
        </div>
        <form class="search-form">
          <h3>UBICACIÓN</h3>
          <div id='geocoder-container'></div>
          <input class="input" name="q" type="search" id="input_location"/>
          <custom-button attributeText="Guardar" class="button_blue"></custom-button>
        </form>
        <custom-button attributeText="Reportar como encontrado" class="button_green"></custom-button>
        <custom-button attributeText="Eliminar reporte" class="button_red" ></custom-button>
    </div>
    `;

    style.innerHTML = `
    #map {
    width: 100%;
    height: 100%;
    }
    .dz-filename, .dz-size, .dz-error-mark, .dz-success-mark, .dz-error-message, .dz-progress, .dz-details, .dz-button {
    display: none;
    }
    .search-form{
      display:flex;
      flex-direction:column;
      align-items:center;
    }
    .mapboxgl-control-container{
    display:none
    }
    .map_container{
      overflow:hidden;
    }
    `;

    const myDropzone = new Dropzone(".profile-picture-container", {
      url: "/falsa",
      clickable: "#agregarImageBtn",
      autoProcessQueue: false,
      acceptedFiles: "image/*",
    });

    myDropzone.on("thumbnail", function (file) {
      state.data.pet.imageUrl = file.dataURL;
      console.log(state.data);
    });

    this.appendChild(style);
  }

  initMap() {
    const { userLat, userLng } = state.data.user;
    const lat = userLat ? Number(userLat) : -34.6037;
    const lng = userLat ? Number(userLng) : -58.3816;
    mapboxgl.accessToken = process.env.MAP_BOX_TOKEN;
    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
    });
  }

  dataInput() {
    const indexPet = state.data.petIndex;
    const { fullName, location } = state.data.pets[indexPet];
    const nameInput = this.querySelector("#input_name") as any;
    const locationInput = this.querySelector("#input_location") as any;
    if (fullName) {
      nameInput.value = fullName;
      locationInput.value = location;
    }
  }
}
customElements.define("editreport-page", EditReport);
