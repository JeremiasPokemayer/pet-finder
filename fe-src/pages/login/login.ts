import { Router } from "@vaadin/router";
import { state } from "../../state";

class Login extends HTMLElement {
  async connectedCallback() {
    this.render();
    this.fillEmailInput();

    try {
      const { latitude, longitude }: any = await this.requestLocation();
      state.data.user.userLat = latitude;
      state.data.user.userLng = longitude;
    } catch (error) {
      console.error("No se pudo obtener la ubicación:", error);
    }

    const buttonSignin = this.querySelector(".button_blue");
    buttonSignin.addEventListener("click", () => {
      const password = this.querySelector('input[name="password"]') as any;
      const email = this.querySelector('input[name="email"]') as any;
      state.data.user.password = password.value;
      state.data.user.email = email.value;
      state.authToken();
      state.signIn();
      Router.go("/mascotas");
    });
  }
  async render() {
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title_auth">Iniciar Sesión</h3>
        <p>Ingresá los siguientes datos para iniciar sesión</p>
        <label>
            <h3>EMAIL</h3>
            <input type="email" name="email" id="email-input">
        </label>
        <label>
            <h3>CONTRASEÑA</h3>
            <input type="password" name="password">
        </label>
        <a href="/auth">Olvidé mi contraseña</a>
        <custom-button attributeText="Acceder" class="button_blue"></custom-button>
    </div>
    `;
  }

  fillEmailInput() {
    const emailInput = this.querySelector("#email-input") as any;
    const mailState = state.data.user.email;
    if (mailState) {
      emailInput.value = mailState;
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
customElements.define("login-page", Login);
