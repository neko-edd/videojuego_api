export default class WebController {
    static async paginaPrincipal(req, res) {
        res.render("completes/index")
    }

    static async paginaLogin(req, res) {
        res.render("completes/login")
    }

    static async paginaRegistro(req, res) {
        res.remder("completes/register")
    }

    static async paginaFavoritos(req, res) {
        res.render("completes/favourites")
    }

    static async paginaCarrito(req, res) {
        res.render("completes/carrito")
    }
}