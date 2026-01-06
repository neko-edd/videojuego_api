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
        if(!user_name || !password){
            return res.status(400).json({message: "Datos incompletos"})
        }
        try {

            const user = await task_repository.startSession(user_name, password)

            if (!user) {
                return res.status(400).json({
                    message: "Usuario o contraseña incorrecta"
                })
            }

            return res.status(200).json({
                user: user
            })
        } catch (error) {
            console.error("Error login:", error.message);
            return res.status(500).json({
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
            const userId = await task_repository.createUser(user_name, password)
            if (!userId) {
                return res.status(400).json({ message: "No se pudo crear el usuario" })
            }
            return res.status(200).json({
                success: true,
                userId
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
        if (!userName || !gameName || price === undefined) {
            res.status(400).json({ message: "No se ha seleccionado ningun juego" })
        }
        try {
            const favourite = await task_repository.addFavourites(userName, gameName, price)

            res.status(200).json({ success: true, favourite })

        } catch (error) {
            console.error("Error insertando favorito:", error)
            res.status(500).json({ success: false })
        }
    }

    static async showFavourites(req, res) {
        const { userName } = req.body
        try {
            const favourites = await task_repository.showFavourites(userName)

            res.status(200).json({ favourites })
        } catch (error) {
            console.error("Error mostrando los favorito:", error)
            res.status(500).json({ message: "Error al cargar los favoritos" })
        }
    }

    static async priceCart(req, res) {
        const { userName, gameName, price, activate } = req.body
        if (!userName && !gameName && price === undefined && activate === undefined) {
            return res.status(400).json({ message: "Datos incompletos" })
        }
        try {
            const carrito = await task_repository.priceCart(userName, gameName, price, activate)
            return res.status(200).json({
                carrito: {
                    id: carrito.id,
                    user_id: carrito.user_id,
                    game_id: carrito.game_id,
                    price: carrito.price,
                    offer: carrito.offer
                }
            })
        } catch (error) {
            console.error("Error al añadir al carrito:", error)
            res.status(500).json({ message: "Error al añadir al favoritos" })
        }
    }
}