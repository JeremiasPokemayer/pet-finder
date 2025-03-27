import { Router } from "@vaadin/router";
import { state } from "../../state";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();

    const botonDarUbicacion = this.querySelector(".button_blue");
    botonDarUbicacion?.addEventListener("click", async () => {
      const { latitude, longitude }: any = await this.requestLocation();
      state.data.user.userLat = latitude;
      state.data.user.userLng = longitude;
      console.log(state.data);
    });

    const botonComoFunciona = this.querySelector(".button_green");
    botonComoFunciona?.addEventListener("click", () => {
      Router.go("/auth");
    });
  }
  render() {
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
      <img class="welcome__image" src="https://i.ibb.co/YBg0FSpJ/eric-ward-ISg37-AI2-A-s-unsplash.jpg">
      <h3 class="title_home">Pet Finder App</h3>
      <h4 class="subtitle_home">Encontrá y reportá mascotas perdidas cerca de tu ubicación</h4>
      <custom-button attributeText="Dar mi ubicación actual" class="button_blue"></custom-button>
      <custom-button attributeText="¿Cómo funciona Pet Finder?" class="button_green"></custom-button>
    </div>
    `;
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
customElements.define("home-page", Home);
