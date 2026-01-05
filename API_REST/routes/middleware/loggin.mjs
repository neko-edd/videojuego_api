export async function log(req, res, next) {
    /*try {
        const {user, passw} = req.session?.user  // o token, o cookie

        if (!user) {
            return res.redirect('/crear-usuario')
        }

        // Buscar usuario en la BD
        const usuario = await Usuario.startSession(user, passw) // ejemplo

        if (!usuario) {
            return res.redirect('/crear-usuario')
        }

        // Guardar usuario para usarlo en la ruta
        req.user = usuario

        next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Error de autenticación')
    }*/
   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
}