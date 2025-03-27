import { Router } from "@vaadin/router";
import { state } from "../../state";

class Register extends HTMLElement {
  connectedCallback() {
    this.render();

    const botonDarUbicacion = this.querySelector(".button_blue");
    botonDarUbicacion?.addEventListener("click", () => {});
  }
  render() {
    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title_auth">Registrarse</h3>
        <p>Ingresá los siguientes datos para realizar el registro</p>
        <form class="form_auth">
          <label>
              <h3>EMAIL</h3>
              <input type="email" name="email">
          </label>
          <label>
              <h3>CONTRASEÑA</h3>
              <input type="password" name="password">
          </label>
          <label>
              <h3>CONFIRMAR CONTRASEÑA</h3>
              <input type="password" name="passwordConfirm">
          </label>
          <p>Ya tenes una cuenta?</p><a href="/">Iniciar sesión.</a>
          <custom-button attributeText="Siguiente" class="button_blue"></custom-button>
        </form>
    </div>
    `;

    const form = this.querySelector(".form_auth");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[name="email"]') as any;
      const passwordInput = form.querySelector('input[name="password"]') as any;
      const passwordConfirmInput = form.querySelector(
        'input[name="passwordConfirm"]'
      ) as any;
      state.data.user.email = emailInput.value;
      if (passwordInput.value == passwordConfirmInput.value) {
        state.data.user.password = passwordInput.value;
        state.signUp();
        Router.go("/login");
      } else {
        alert("Las contraseñas no coinciden");
      }
    });
  }
}
customElements.define("register-page", Register);
