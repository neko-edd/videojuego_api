import task_repository from "../repositories/task_repository.mjs";

export default class task_controllers {
    static async paginaPrincipal(req, res) {
        try {
            return res.status(200).json({
                message: "Pagina Principal"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error en la API" });
        }
    }
    static async startSession(req, res) {
        const { user_name, password } = req.body
        try {

            const result = await task_repository.startSession(user_name, password)

            if (!result) {
                return res.status(401).json({
                    message: "Usuario o contraseña incorrecta"
                })
            }

            return res.status(200).json({
                user: result
            })
        } catch (error) {
            console.error("Error login:", error.message);
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }
    }

    static async createUser(req, res) {
        const { user_name, password } = req.body
        if (!user_name || !password) {
            return res.status(400).json({ message: "Datos incompletos" })
        }
        try {
            const userCredential = await task_repository.createUser(user_name, password)
            return res.status(200).json({
                userCredential
            })

        } catch (error) {
            return res.status(500).json({ error: "Error al crear el usuario" })
        }
    }

    static async showCatalog(req, res) {
        try {
            const juegos = await task_repository.showCatalog();
            return res.status(200).json({ juegos });

        } catch (error) {
            console.error("Error al obtener catálogo:", error.message);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    static async addFavourites(req, res) {
        const { userName, gameName, price } = req.body
        try {
            const result = await task_repository.addFavourites(userName, gameName, price)
            if (!result) {
                res.status(500).json({ message: "No se ha seleccionado ningun juego" })
            }
            res.status(200).json({ success: true, result })

        } catch (error) {
            console.error("Error insertando favorito:", error)
            res.status(500).json({ success: false })
        }
    }

    static async showFavourites(req, res) {
        const { userName } = req.body
        try {
            const favourites = await task_repository.showFavourites(userName)
            if (!favourites) {
                res.status(500).json({ message: "No hay ningun juego en favoritos" })
            }

            res.status(200).json({ favourites })
        } catch (error) {
            console.error("Error mostrando los favorito:", error)
            res.status(500).json({ message: "Error al cargar los favoritos" })
        }
    }

    static async priceCart(req, res) {
        const { userName, gameName, price, activate } = req.body
        if (!user && !game && !price && !activate) {
            return res.status(400).json({ message: "Datos incompletos" })
        }
        try {
            const carrito = await task_repository.priceCart(userName, gameName, price, activate)
            return res.status(200).json({
                user: {
                    id: carrito.id,
                    user_name: carrito.user_name,
                    name_game: carrito.name_game,
                    price: carrito.price,
                    activate: carrito.activate
                }
            })
        } catch (error) {
            console.error("Error al añadir al carrito:", error)
            res.status(500).json({ message: "Error al añadir al favoritos" })
        }
    }
}