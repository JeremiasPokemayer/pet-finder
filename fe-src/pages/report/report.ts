import { Router } from "@vaadin/router";
import { state } from "../../state";
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

class Report extends HTMLElement {
  connectedCallback() {
    this.render();
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

    const botonReport = this.querySelector(".button_green");
    botonReport.addEventListener("click", (e) => {
      e.preventDefault();
      const formName = this.querySelector(".form_name");
      const formLocation = this.querySelector(".search-form");
      const inputName = formName.querySelector('input[name="name"]') as any;
      const inputLocation = formLocation.querySelector(
        'input[name="q"]'
      ) as any;

      const dataPet = {
        petName: inputName.value,
        status: "Perdido",
        petLocation: inputLocation.value,
      };
      state.setPet(dataPet);
      console.log(state.data);
    });

    const botonCancel = this.querySelector(".button_gray");
    botonCancel.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/mascotas");
    });
  }
  async render() {
    const style = document.createElement("style");
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title">Reportar mascota</h3>
        <p>Ingresá la siguiente información para realizar el reporte de la mascota</p>
        <form class="form_name">
          <label>
              <h3>NOMBRE</h3>
              <input type="name" name="name" class="input">
          </label>
        </form>
        <div class="container_dropzone">
          <div class="profile-picture-container"></div>
          <custom-button attributeText="Agregar Foto" class="button_blue" id="agregarImageBtn"></custom-button>
        </div>
        <div class="map_container">
          <div id="map" style="width: 310px; height: 310px;"></div>
        </div>
        <form class="search-form">
          <h3>UBICACIÓN</h3>
          <div id='geocoder-container'></div>
          <input class="input" name="q" type="search" />
          <custom-button attributeText="Reportar mascota" class="button_green"></custom-button>
        </form>
        <custom-button attributeText="Cancelar" class="button_gray" ></custom-button>
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
    });
  }
}
customElements.define("report-page", Report);
