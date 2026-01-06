import express from "express";
const router = express.Router();

// Ruta de inicio
router.get("/", (req, res) => {
  res.render("completes/index", { title: "Página de Inicio" });
});

export default router;