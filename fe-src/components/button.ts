export async function initButton() {
  customElements.define(
    "custom-button",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }
      render() {
        const variant = this.getAttribute("class");
        const textButton = this.getAttribute("attributeText");
        const button = document.createElement("button");
        const style = document.createElement("style");
        button.className = variant;
        button.textContent = textButton;

        style.innerHTML = `
                .button_green{
                    font-family:"Poppins";
                    width: 270px;
                    height: 50px;
                    background-color:rgba(0, 168, 132, 1);
                    color:white;
                    border-radius: 6px;
                    border:none;
                    margin:10px 0px;
                }
                .button_blue{
                    font-family:"Poppins";
                    width: 270px;
                    height: 50px;
                    background-color:rgba(90, 143, 236, 1);
                    color:white;
                    border-radius: 6px;
                    border:none;
                    margin:10px 0px;
                }
                .button_blue2{
                    font-family:"Poppins";
                    width: 270px;
                    height: 50px;
                    background-color:rgba(90, 143, 236, 1);
                    color:white;
                    border-radius: 6px;
                    border:none;
                    margin:10px 0px;
                }    
                .button_red{
                    font-family:"Poppins";
                    width: 270px;
                    height: 50px;
                    background-color:rgba(235, 99, 114, 1);
                    color:white;
                    border-radius: 6px;
                    border:none;
                    margin:10px 0px;
                }
                .button_gray{
                    font-family:"Poppins";
                    width: 270px;
                    height: 50px;
                    color:white;
                    background-color:rgba(74, 85, 83, 1);
                    border-radius: 6px;
                    border:none;
                    margin:10px 0px;

                }
            `;

        button.appendChild(style);
        this.appendChild(button);
      }
    }
  );
}
