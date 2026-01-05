import express from "express"
import taskControllers from "../controllers/task_controller.mjs"
//import { log } from '../middleware/loggin.mjs'

const router = new express.Router()

router.post("/pagina-principal", /*log*/ taskControllers.paginaPrincipal /*EN CONTROLLER -> HACER EL const paginaPrincipal = (req, res) .. res.json({bla bla})*/)
router.post("/inicio-sesion", taskControllers.startSession) //usuarios
router.post("/crear-usuario", taskControllers.createUser) //usuarios
router.post("/catalogo", taskControllers.showCatalog) //juegos
router.post("/favoritos", taskControllers.showFavourites)
//router.post("/noticias", taskControllers.())
router.post("/add-favoritos", taskControllers.addFavourites) //favoritos //ventas
router.post("/carrito", taskControllers.priceCart) //carrito
//router.post("/inicio-sesion/ofertas", taskControllers.()) //ventas
/*router.post("/add-ofertas", taskControllers.addOffer)*/ //ventas

export default router