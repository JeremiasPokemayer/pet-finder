import { Router } from "@vaadin/router";
import { state } from "../../state";

class ModificarPass extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setPassword();
    this.addTogglePasswordVisibility();
    const buttonSave = this.querySelector(".button_blue");
    buttonSave.addEventListener("click", (e) => {
      const password = this.querySelector('input[name="password"]') as any;
      state.data.updatePassword = password.value;
      state.updatePassword();
      Router.go("/mascotas");
    });
  }
  async render() {
    const style = document.createElement("style");

    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
        <h3 class="title_auth">Contraseña</h3>
        <form>
          <label>
              <h3>CONTRASEÑA</h3>
              <input type="password" name="password"  id="password-input">
              <button class="button_Password" id="togglePassword">Mostrar</button>
          </label>
          <label>
        </form>
              <h3>CONFIRMAR CONTRASEÑA</h3>
              <input type="password" name="passwordConfirm" id="passwordConfirm-input">
              <button class="button_ConfirmPassword" id="toggleConfirmPassword">Mostrar</button>
        </label>
        <custom-button attributeText="Guardar" class="button_blue" type="submit"></custom-button>            
    </div>
    `;

    style.innerHTML = `
      .button_Password, .button_ConfirmPassword{
        border:none;
        background-color:black;
        color:white;
      }
    `;

    this.appendChild(style);
  }

  setPassword() {
    const { password } = state.data.user;
    const passwordInput = this.querySelector("#password-input") as any;
    if (password) {
      passwordInput.value = password;
    }
  }

  addTogglePasswordVisibility() {
    const togglePassword = this.querySelector("#togglePassword");
    const passwordInput = this.querySelector("#password-input");

    togglePassword.addEventListener("click", (e) => {
      e.preventDefault();
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePassword.textContent = type === "password" ? "Mostrar" : "Ocultar";
    });

    const toggleConfirmPassword = this.querySelector("#toggleConfirmPassword");
    const confirmPasswordInput = this.querySelector("#passwordConfirm-input");

    toggleConfirmPassword.addEventListener("click", (e) => {
      e.preventDefault();
      const type =
        confirmPasswordInput.getAttribute("type") === "password"
          ? "text"
          : "password";
      confirmPasswordInput.setAttribute("type", type);
      toggleConfirmPassword.textContent =
        type === "password" ? "Mostrar" : "Ocultar";
    });
  }
}
customElements.define("changepass-page", ModificarPass);
