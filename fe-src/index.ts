import Dropzone from "dropzone";
import "./router";
import "./pages/welcome/welcome";
import "./pages/mascotas/mascotas";
import "./pages/misMascotas/";
import "./pages/login/login";
import "./pages/auth/auth";
import "./pages/register/register";
import "./pages/report/report";
import "./pages/editReport/";
import "./pages/datos/index";
import "./pages/modificarData/";
import "./pages/modificarPass/";
import { initButton } from "./components/button";
import { initHeader } from "./components/header";
(function () {
  initHeader();
  initButton();
})();
