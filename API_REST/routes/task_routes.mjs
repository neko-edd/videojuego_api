import express from "express"
import taskControllers from "../controllers/task_controller.mjs"
import { checkSession } from '../middleware/loggin.mjs'

const router = new express.Router()

router.post("/pagina-principal", taskControllers.paginaPrincipal /*EN CONTROLLER -> HACER EL const paginaPrincipal = (req, res) .. res.json({bla bla})*/)
router.post("/inicio-sesion", taskControllers.startSession) //usuarios
router.post("/crear-usuario", taskControllers.createUser) //usuarios
router.post("/catalogo", taskControllers.showCatalog) //juegos
router.post("/favoritos", checkSession, taskControllers.showFavourites)
router.post("/add-favoritos", checkSession, taskControllers.addFavourites) //favoritos //ventas
router.post("/carrito",checkSession, taskControllers.priceCart) //carrito


export default router