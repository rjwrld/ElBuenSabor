import jwt from 'jsonwebtoken'
import Usuario from '../src/models/usuarios.js'


const identificarUsuario = async (req, res, next) => {
    //Identificar si hay un token en cookies
    const { _token } = req.cookies
    if (!_token) {
        req.usuario = null;
        return next()
    }

    //Comprobar token 
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        if (usuario) {
            req.usuario = usuario;
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identificarUsuario;