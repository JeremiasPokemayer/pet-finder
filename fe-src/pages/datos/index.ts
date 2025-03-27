import { Router } from "@vaadin/router";
import { state } from "../../state";

class Datos extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    let email =
      state.data.user && state.data.user.email
        ? state.data.user.email
        : "Inicia sesión o regístrate!";

    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title_auth">Mis datos</h3>
        <custom-button attributeText="Modificar datos personales" class="button_blue" type="submit"></custom-button>    
        <custom-button attributeText="Modificar contraseña" class="button_blue2" type="submit"></custom-button>
        <p>${email}</p>
        <a href="/register" style="display: ${
          email === "Inicia sesión o regístrate!" ? "none" : "block"
        };>CERRAR SESIÓN.</a>
    </div>
    `;

    const botonModificarData = this.querySelector(".button_blue");
    const botonModificarPass = this.querySelector(".button_blue2");
    botonModificarData.addEventListener("click", () => {
      Router.go("/changedata");
    });
    botonModificarPass.addEventListener("click", () => {
      Router.go("/changepass");
    });
  }
}
customElements.define("datos-page", Datos);
