import { Router } from "@vaadin/router";
import { state } from "../../state";

class Auth extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <img src="https://i.ibb.co/0yVNrDJT/undraw-login-re-4vu2-1.png" alt="">
        <h3 class="title_auth">Ingresar</h3>
        <p>Ingresá tu email para continuar.</p>
        <form class="form_auth">
            <label>
                <h3>Email</h3>
                <input type="email" name="email">
            </label>
            <custom-button attributeText="Siguiente" class="button_blue" type="submit"></custom-button>
        </form>
        <p>Aún no tenes cuenta?</p><a href="/register">Registrate.</a>
    </div>
    `;

    const form = this.querySelector(".form_auth");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[name="email"]') as any;
      state.data.user.email = emailInput.value;
      console.log(state.data);
      if (!emailInput.value) {
        alert("Por favor, ingresa tu correo electrónico antes de continuar.");
        return;
      }
      Router.go("/login");
    });
  }
}
customElements.define("auth-page", Auth);
