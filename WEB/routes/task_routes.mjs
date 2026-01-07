import express from "express";
import taskControllers from "../controlles/task_controllers.mjs";

const router = express.Router();

// Rutas que renderizan vistas
router.get("/", taskControllers.paginaPrincipal);
router.get("/login", taskControllers.paginaLogin);
router.get("/registro", taskControllers.paginaRegistro);
router.get("/favoritos", taskControllers.paginaFavoritos);
router.get("/carrito", taskControllers.paginaCarrito);

export default router;
/*const router = express.Router();

router.get("/", taskControllers.paginaPrincipal);

router.get("/login", (req, res) => {
    res.render("completes/login");
});

router.get("/registro", (req, res) => {
    res.render("completes/register");
});

router.get("/favoritos", (req, res) => {
    res.render("completes/favoritos");
});

router.get("/carrito", (req, res) => {
    res.render("completes/carrito");
});

export default router;*/