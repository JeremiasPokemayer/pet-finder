import { Router } from "@vaadin/router";
import { state } from "../../state";

class HomeMascotas extends HTMLElement {
  async connectedCallback() {
    this.render();
  }
  async render() {
    const style = document.createElement("style");
    state.data.pets = [];
    await state.getPets();
    const pets = state.data.pets;
    console.log(pets);
    console.log(state.data);

    const petsHTML = pets
      .map(
        (pet, index) => `
      <div class="container_report">
        <img src="${pet.imageUrl}" alt="" class="image_pet">
        <div class="container_report-nameAndLocation">
          <h2>${pet.fullName}</h2>
          <h4>${pet.location}</h4>
        </div>
        <button class="button_report" data-pet-name="${pet.fullName}" attribute="${index}">Reportar</button>
      </div>
    `
      )
      .join("");

    this.innerHTML = `
    <custom-header></custom-header>
    <div class="main">
      <h3 class="title_home-mascotas">Mascotas perdidas cerca</h3>
      <div class="container_reports">
        ${petsHTML}      
      </div>
    </div>
    <div id="modal" class="modal">
      <div class="modal-content">
        <div class="container_form">
          <h2>Reportar info de <span id="pet-name"></span></h2>
          <label>
            NOMBRE:
            <input type="text" id="name-input" class="input_text"/>
          </label>
          <label>
            TELÉFONO:
            <input type="text" id="phone-input" class="input_text"/>
          </label>
          <label>
            ¿DÓNDE LO VISTE?
            <input type="text" id="where-input" class="input_where"/>
          </label>
          <custom-button attributeText="Enviar información" class="button_green" ></custom-button>
        <div>
      </div>
    </div> 

    `;

    style.innerHTML = `
      .container_reports{
      font-family:"Poppins";
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      @media (min-width:960px){
        .container_reports {
         display: grid;
         grid-template-columns: 1fr 1fr 1fr;
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
      .button_report{
        background-color:rgba(235, 99, 114, 1);
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

      .container_form{
        display:flex;
        flex-direction:column;
        align-items:center;
        color:white;
      }
      
      .modal {
        display: none; /* Oculto por defecto */
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        height:100%;
        width:100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4); /* Fondo semi-transparente */
      }

      .modal-content {
        background-color: rgba(38, 48, 46, 1);
        margin: 15% auto;
        padding: 20px;
        height:70vh;
        border: 1px solid #888;
        width: 80%;
        font-family:"Poppins";
      }

      .close-button {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }

      .close-button:hover,
      .close-button:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }

      .input_text{
        background-color: rgba(74, 85, 83, 1);
        margin-bottom:20px;
        width:100%;
      }
      
      .input_where{
        background-color: rgba(74, 85, 83, 1);
        height:131px;
        margin-bottom:20px;
        width:100%;
      }

    `;

    const reportButtons = document.querySelectorAll(".button_report");
    reportButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        state.data.petIndex = button.getAttribute("attribute");
        console.log(state.data.petIndex);
        const petName = button.getAttribute("data-pet-name");
        document.getElementById("pet-name").textContent = petName;
        document.getElementById("modal").style.display = "block";
      });
    });

    const buttonSend = document.querySelector(".button_green");
    buttonSend.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.data;
      const userId = cs.pets[cs.petIndex].reportId;
      const objectID = cs.pets[cs.petIndex].objectID;
      const nameReport: any = document.getElementById("name-input");
      const phoneReport: any = document.getElementById("phone-input");
      const whereReport: any = document.getElementById("where-input");
      state.data.reportName = nameReport.value;
      state.data.reportPhone = phoneReport.value;
      state.data.reportWhere = whereReport.value;

      state.setReport(objectID, userId);
      console.log(state.data, objectID, userId);
    });

    window.addEventListener("click", (event) => {
      const modal = document.getElementById("modal");
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

    this.appendChild(style);
  }

  cloneReport() {
    const divEl = document.createElement("div");
  }
}
customElements.define("home-page-mascotas", HomeMascotas);
