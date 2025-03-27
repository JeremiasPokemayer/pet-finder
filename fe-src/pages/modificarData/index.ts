import { Router } from "@vaadin/router";
import { state } from "../../state";

class ModificarData extends HTMLElement {
  connectedCallback() {
    this.render();
    this.getNameAndLocality();
    const buttonSignin = this.querySelector(".button_blue");
    buttonSignin.addEventListener("click", async () => {
      const { latitude, longitude }: any = await this.requestLocation();
      state.data.user.userLat = latitude;
      state.data.user.userLng = longitude;
      console.log(latitude, longitude);
      const fullName = this.querySelector("#name-input") as any;
      const location = this.querySelector("#locality-input") as any;
      state.setNameAndLocality(fullName.value, location.value);
      state.updateNameAndLocation();
      Router.go("/mascotas");
    });
  }
  async render() {
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title_auth">Datos personales</h3>
        <label>
            <h3>NOMBRE</h3>
            <input type="name" name="name" id="name-input">
        </label>
        <label>
            <h3>LOCALIDAD</h3>
            <input type="locality" name="locality" id="locality-input">
        </label>
        <custom-button attributeText="Guardar" class="button_blue" type="submit"></custom-button>    
    </div>
    `;
  }

  getNameAndLocality() {
    const { fullName, location } = state.data.user;
    const nameInput = this.querySelector("#name-input") as any;
    const localityInput = this.querySelector("#locality-input") as any;
    if (fullName && location) {
      nameInput.value = fullName;
      localityInput.value = location;
    }
  }

  requestLocation() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error);
            alert(
              "No se pudo obtener la ubicación. Asegúrate de que los permisos estén habilitados."
            );
            reject(error);
          }
        );
      } else {
        alert("La geolocalización no está soportada en este navegador.");
        reject(new Error("Geolocalización no soportada"));
      }
    });
  }
}
customElements.define("changedata-page", ModificarData);
