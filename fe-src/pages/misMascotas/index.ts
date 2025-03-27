import { Router } from "@vaadin/router";
import { state } from "../../state";

class MisMascotas extends HTMLElement {
  async connectedCallback() {
    this.render();
  }
  async render() {
    const style = document.createElement("style");
    state.data.pets = [];
    await state.getPetsById();
    const pets = state.data.pets;

    let contentHTML;

    if (pets.length > 0) {
      const petsHTML = pets
        .map(
          (pet, index) => `
      <div class="container_report" id="${index}">
        <img src="${pet.imageUrl}" class="image_pet">
        <div class="container_report-nameAndLocation">
          <h2>${pet.fullName}</h2>
          <h4>${pet.location}</h4>
        </div>
        <button class="button_edit" attribute="${index}">Editar</button>
      </div>
    `
        )
        .join("");

      contentHTML = `
      <div class="container_reports">
        ${petsHTML}      
      </div>
    `;
    } else {
      contentHTML = `
      <div class="empty-report">
        <h3>Reports (Vacío)</h3>
        <p>Aún no reportaste mascotas perdidas</p>
        <img src="https://i.ibb.co/TxqBnyTz/4560004.jpg" alt="" class="img_report">
        <custom-button attributeText="Publicar reporte" class="button_blue" ></custom-button>
      </div>
    `;
    }

    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
      <h3 class="title_home-mascotas">Mascotas reportadas</h3>    
      ${contentHTML}      
    </div>
    `;

    style.innerHTML = `
      .container_reports{
      font-family:"Roboto";
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      @media (min-width:960px){
        .container_reports {
          flex-direction: row;
        }
      }

      .image_pet{
        height:100px;
        width:auto;
        grid-area: image;
        margin-top:10px;
      }
      .container_report-nameAndLocation{
        margin-left:20px;
        display:flex;
        flex-direction:column;
        align-items: flex-start;
        width:auto;
        grid-area: text;
        color:white;
      }
      .button_edit{
        background-color:rgba(90, 143, 236, 1);
        height:80px;
        border:none;
        border-radius:5px;
        color:white;
        grid-area: button;
      }
      .container_report{
        display:grid;
        background-color:rgba(38, 48, 46, 1);
        grid-template-columns: 111px 111px 111px;
        margin: 0px 20px 20px 0px;
        width:335px;
        height:240px;
        grid-template-areas: 
        ". image ."
        "text . button";
      }
      
      .empty-report{
        display:flex;
        flex-direction:column;
        align-items:center;
      }

      .img_report{
        width:400px;
        height:300px;
      }
    `;

    this.appendChild(style);

    const editsButtons = document.querySelectorAll(".button_edit");
    editsButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        state.data.petIndex = button.getAttribute("attribute");
        Router.go("/editreport");
      });
    });

    const buttonReport = document.querySelector(".button_blue");
    buttonReport.addEventListener("click", (e) => {
      Router.go("/report");
    });
  }
}
customElements.define("mismascotas-page", MisMascotas);
