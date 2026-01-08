export function checkSession(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ 
            authenticated: false,
            message: "Sesión no iniciada" 
        });
    }
    next();
}

export default {
    checkSession
};