import express from "express"
import taskControllers from "../controllers/task_controller.mjs"
import { checkSession } from './middleware/loggin.mjs'

const router = new express.Router()

router.get("/pagina-principal", taskControllers.paginaPrincipal /*EN CONTROLLER -> HACER EL const paginaPrincipal = (req, res) .. res.json({bla bla})*/)
router.post("/inicio-sesion", taskControllers.startSession) //usuarios
router.post("/crear-usuario", taskControllers.createUser) //usuarios
router.get("/catalogo", taskControllers.showCatalog) //juegos
router.get("/favoritos", checkSession, taskControllers.showFavourites)
router.post("/add-favoritos", checkSession, taskControllers.addFavourites) //favoritos //ventas
router.post("/carrito",checkSession, taskControllers.priceCart) //carrito
router.get("/get-session", taskControllers.getSession)
router.put("/change-password", checkSession, taskControllers.changePassword)
router.delete("/delete-user", checkSession, taskControllers.deleteUser)


export default router