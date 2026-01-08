import express from "express"
import taskControllers from "../controllers/task_controller.mjs"
import { checkSession } from './middleware/loggin.mjs'

const router = new express.Router()

router.get("/pagina-principal", taskControllers.paginaPrincipal)
router.post("/inicio-sesion", taskControllers.startSession) 
router.post("/crear-usuario", taskControllers.createUser) 
router.get("/catalogo", taskControllers.showCatalog) 
router.get("/favoritos", checkSession, taskControllers.showFavourites)
router.post("/add-favoritos", checkSession, taskControllers.addFavourites) 
router.post("/carrito", checkSession, taskControllers.showCart)
router.post("/add-carrito", checkSession, taskControllers.addPriceCart) 
router.get("/get-session", taskControllers.getSession)
router.put("/change-password", checkSession, taskControllers.changePassword)
router.delete("/delete-user", checkSession, taskControllers.deleteUser)
router.get("/stats/most-sold", taskControllers.getMostSoldGames)
router.get("/search", taskControllers.searchGames)
router.get("/stats/most-favorited", taskControllers.getMostFavoritedGames)

export default router