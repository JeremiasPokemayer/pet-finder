import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/register", component: "register-page" },
  { path: "/login", component: "login-page" },
  { path: "/auth", component: "auth-page" },
  { path: "/mascotas", component: "home-page-mascotas" },
  { path: "/mismascotas", component: "mismascotas-page" },
  { path: "/datos", component: "datos-page" },
  { path: "/report", component: "report-page" },
  { path: "/editreport", component: "editreport-page" },
  { path: "/changedata", component: "changedata-page" },
  { path: "/changepass", component: "changepass-page" },
]);
