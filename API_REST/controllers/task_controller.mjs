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
        if (!user_name || !password) {
            return res.status(400).json({ message: "Datos incompletos" })
        }
        try {

            const user = await task_repository.startSession(user_name, password)

            if (!user) {
                return res.status(400).json({
                    message: "Usuario o contraseña incorrecta"
                })
            }

            req.session.user = {
                user_name: user.user_name
            };

            return res.status(200).json({
                success: true,
                user: {
                    user_name: user.user_name
                }
            })

        } catch (error) {
            console.error("Error login:", error.message);
            return res.status(500).json({
                error: "Credenciales incorrectas"
            });
        }
    }

    static async createUser(req, res) {
        const { user_name, password } = req.body;

        console.log("Datos recibidos en createUser:", { user_name, password });

        if (!user_name || !password) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        try {
            const userId = await task_repository.createUser(user_name, password);
            return res.status(201).json({
                success: true,
                userId
            });
        } catch (error) {
            console.error("ERROR createUser controller:", error); // log completo
            if (error?.code === "23505") {
                return res.status(400).json({ message: "Usuario ya existe" });
            }
            return res.status(500).json({ message: "Error al crear el usuario" });
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
        const userName = req.session.user?.user_name;
        const { gameName, price } = req.body
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
        try {
            console.log("SESSION COMPLETA:", req.session);
            console.log("USER EN SESSION:", req.session.user);

            const favourites = await task_repository.showFavourites(
                req.session.user.user_name
            );

            res.status(200).json(favourites);
        } catch (err) {
            console.error("ERROR showFavourites controller:", err);
            res.status(500).json({ error: "Error cargando favoritos" });
        }
    }

    static async addPriceCart(req, res) {
        const userName = req.session.user?.user_name;
        const { gameName, price } = req.body;

        if (!userName) {
            return res.status(401).json({ message: "No hay sesión activa" });
        }

        if (!gameName || price === undefined) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        try {
            const result = await task_repository.addPriceCart(userName, gameName, price);

            return res.status(200).json({
                success: true,
                message: "Juego añadido al carrito",
                carrito: result
            });
        } catch (error) {
            console.error("Error al añadir al carrito:", error);
            return res.status(500).json({
                success: false,
                message: "Error al añadir al carrito"
            });
        }
    }
    static async showCart(req, res) {
        try {

            const userName = req.session.user?.user_name;

            if (!userName) {
                return res.status(401).json({ message: "No hay sesión activa" });
            }

            const carrito = await task_repository.showCart(userName);
            console.log("Carrito a enviar:", carrito);
            return res.status(200).json({ carrito });
        } catch (err) {
            console.error("ERROR showCart controller:", err);
            return res.status(500).json({ error: "Error cargando carrito" });
        }
    }
    static async changePassword(req, res) {
        const userName = req.session.user?.user_name;
        const { oldPassword, newPassword } = req.body;

        if (!userName) {
            return res.status(401).json({ message: "No hay sesión activa" });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        try {
            const result = await task_repository.changePassword(userName, oldPassword, newPassword);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            return res.status(500).json({ message: "Error al cambiar contraseña" });
        }
    }

    static async deleteUser(req, res) {
        const userName = req.session.user?.user_name;
        const { password } = req.body;

        if (!userName) {
            return res.status(401).json({ message: "No hay sesión activa" });
        }

        if (!password) {
            return res.status(400).json({ message: "Se requiere la contraseña" });
        }

        try {
            const result = await task_repository.deleteUser(userName, password);

            if (result.success) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error al destruir sesión:", err);
                    }
                });

                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            console.error("Error al borrar usuario:", error);
            return res.status(500).json({ message: "Error al borrar usuario" });
        }
    }

    static getSession(req, res) {
        if (req.session && req.session.user) {
            return res.status(200).json({
                authenticated: true,
                user: req.session.user
            });
        } else {
            return res.status(401).json({
                authenticated: false
            });
        }
    }
}