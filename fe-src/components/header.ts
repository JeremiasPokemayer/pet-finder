import { state } from "../state";
export async function initHeader() {
  customElements.define(
    "custom-header",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }
      render() {
        let emailContent = "";
        const shadow = this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        const style = document.createElement("style");
        div.className = "header";
        if (state.data.user && state.data.user.email) {
          emailContent = state.data.user.email;
        } else {
          emailContent = `
            <a href="/login" class="login-link">Inicia sesión</a> o 
            <a href="/register" class="signup-link">regístrate</a>!
          `;
        }
        div.innerHTML = `
        <div class="header__home">
          <img class="header__image_logo" src="https://s3-alpha-sig.figma.com/img/6178/8357/c19ead6c7eecf06b3b1ac2dfd5631d44?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gi8e0-8dDUYNv1F-Zv51i8LmGAa7R3P~VA~S4dNGoyeqPhEzlTu4eqRi-GrraxqEu3U~ppjnAH1CPmiUfRMcVaU1uVtby387faSRq3bG-qOVZZlO5-gJZCnRiIFeL76IRtarxK~repZNLxr4gF0WJONqUjj3LXuCORmrOE~VE4iDuTBdVhjIgAFCpqgyEWfjICWM~Y4w~-Nip5QojyndiTjiexyfJV-saruZWQvCvNZ8JTAnb1NB93cQGpBlkioVr19kxx4Z8ln1LmM9hW1a4pKwi6IEx7IwKmDPc3YjlCXX9O6UEm~~1NHvTqChhrJMdb4OKxK-pH0AtsS2KLBHKg__"></img>
          <button class="header__button-abrir">
            <img
              src="https://i.ibb.co/dwPt6rf7/menu.png"
              alt=""
              class="header__button-image"
            />
          </button>
        </div>
        <div class="header__oculto">
          <div class="header__oculto-config">
            <button class="header__button-cerrar">X</button>
            <div class="header__servicios-oculto">
              <a class="header__servicios-desktop-portfolio-oculta" href="/datos">Mis datos</a>
              <a class="header__servicios-desktop-servicios-oculta" href="/mismascotas">Mis mascotas reportadas</a>
              <a class="header__servicios-desktop-contacto-oculta"  href="/report">Reportar mascota</a>
              <a class="header__servicios-desktop-contacto-oculta"  href="/mascotas">Mascotas cerca</a>
            </div>
            <p>${emailContent}</p>
            <a href="/login" id="logout-link">CERRAR SESIÓN</a>
          </div>
        </div>
        `;

        style.innerHTML = `
          .header__image_logo{
            width:40px;
            height:40px;
          }

          .header__button-image{
            width:30px;
            height:30px;
          }
          .header__button-abrir{
            background-color:rgba(38, 48, 46, 1);
            border:none;
          }

          .header__button-cerrar{
            background-color:rgba(38, 48, 46, 1);
            color:white;
            border:none;
            position:absolute;
            right: 35px;
            top: 35px;
          }

          .header__home{
            font-family:"Poppins";
            display:flex;
            width: 99%;
            height: 60px;
            padding:10px 18px;
            justify-content: space-between;
            background-color:rgba(38, 48, 46, 1);
          }

          .header__oculto{
            display:none;
          }

          .header__oculto-config{
            font-family:"Poppins";
            position:relative;
            display:flex;
            flex-direction:column;
            align-items: center;
            justify-content: space-around;
            width: 96%;
            height: 100vh;
            padding:10px 18px;
            background-color:rgba(38, 48, 46, 1);
          }
          
          .header__servicios-oculto{
            display:flex;
            flex-direction:column;
          }
          `;

        ventanaOcultaServices(div);

        shadow.appendChild(div);
        shadow.appendChild(style);

        const logoutLink = div.querySelector("#logout-link");
        logoutLink.addEventListener("click", (e) => {
          localStorage.removeItem("appState");
          const data = {
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
          };
          state.setState(data);
          console.log(state.data);
        });
      }
    }
  );
}

function ventanaOcultaServices(header) {
  const botonAbrir = header.querySelector(".header__button-abrir");
  const botonCerrar = header.querySelector(".header__button-cerrar");
  const ventanaHome = header.querySelector(".header__home");
  const ventanaHide = header.querySelector(".header__oculto");

  botonAbrir.addEventListener("click", () => {
    ventanaHome.style.display = "none";
    ventanaHide.style.display = "block";
  });
  botonCerrar.addEventListener("click", () => {
    ventanaHome.style.display = "";
    ventanaHide.style.display = "none";
  });
}
