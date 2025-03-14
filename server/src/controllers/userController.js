import Usuario from '../models/usuarios.js'
import { generarId, generarJWT } from '../../helpers/tokens.js'
import { check, validationResult } from 'express-validator';
import identificarUsuario from '../../middleware/identificarUsuario.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


const insertUsuario = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    let errores = [];
    let success = [];
    if (!nombre) errores.push({ msg: 'El nombre es obligatorio' });
    if (!correo) errores.push({ msg: 'El correo es obligatorio' });
    if (!contrasena) errores.push({ msg: 'La contraseña es obligatoria' });
    if (errores.length > 0) {
        return res.render('auth/registro', { layout: false, errores, success });
    }

    try {
        const usuario = await Usuario.findOne({
            where: {
                correo: correo
            }
        });

        if (usuario) {
            errores.push({ msg: 'Intente con un correo diferente' });
            return res.render('auth/registro', { layout: false, errores, success });
        }
        await Usuario.create({
            nombre: nombre,
            correo: correo,
            contrasena: contrasena,
            rol_id: 1,
            token: generarId()
        });

        success.push({ msg: 'Usuario creado con éxito' });
        return res.render('auth/registro', { layout: false, usuario: req.body, errores, success });
    } catch (error) {
        console.error('Error al crear usuario', error);
        errores.push({ msg: 'Error interno del servidor' });
    }
    return res.render('auth/registro', { layout: false, errores, success });
}

const getUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body
        let errores = [];
        let success = [];

        if (!correo) errores.push({ msg: 'El correo es obligatorio' });
        if (!contrasena) errores.push({ msg: 'La contraseña es obligatoria' });
        if (errores.length > 0) {
            return res.render('login', { layout: false, errores, success });
        }

        // Buscar al usuario en base de datos
        const usuario = await Usuario.findOne({
            where: {
                correo: correo
            }
        });

        if (usuario) {
            if (!usuario.verificarPassword(contrasena)) {
                errores.push({ msg: 'Credenciales incorrectas' });
                return res.render('login', { layout: false, errores, success });
            }
            console.log(`Usuario ${usuario.correo} autenticado correctamente!`);
            // Generar JWT
            const token = generarJWT({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol_id, correo: usuario.correo });
            // console.log("Token generado:", jwt.decode(token));
            return res.cookie('_token', token, {
                httpOnly: true
                //secure: true,
                //sameSite: true
            }).redirect('/');

        } else {
            console.log(`No se encontró un usuario con el correo: ${correo}`);
            errores.push({ msg: 'Debe ponerse en contacto con el administrador para crear una cuenta!' });
            return res.render('login', { layout: false, errores, success });
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.render('login', {
            layout: false,
            errores: [{ msg: 'Error al obtener usuario' }],
            success: []
        });
    }
}


const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/');
}


const profileView = (req, res, next) => {
    const usuario = req.usuario
    res.render('auth/profile', { usuario })
}

const updatePassword = async (req, res, next) => {
    const { correo, contrasena, primerNuevaContrasena, segundaNuevaContrasena } = req.body;
    let errores = [];
    let success = [];

    if (!correo) errores.push({ msg: 'El correo es obligatorio' });
    if (!contrasena) errores.push({ msg: 'La contraseña actual es obligatoria' });
    if (!primerNuevaContrasena) errores.push({ msg: 'La nueva contraseña es obligatoria' });
    if (!segundaNuevaContrasena) errores.push({ msg: 'Debe confirmar la nueva contraseña' });

    if (errores.length > 0) {
        return res.render('auth/updateUsuario', { layout: false, errores, success });
    }
    if (primerNuevaContrasena !== segundaNuevaContrasena) {
        errores.push({ msg: 'La nueva contraseña debe coincidir' });
        return res.render('auth/updateUsuario', { layout: false, errores, success });
    }

    try {
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            errores.push({ msg: 'Usuario no encontrado' });
            return res.render('auth/updateUsuario', { layout: false, errores, success });
        }

        if (!usuario.verificarPassword(contrasena)) {
            errores.push({ msg: 'Credenciales incorrectas' });
            return res.render('auth/updateUsuario', { layout: false, errores, success });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(primerNuevaContrasena, salt);

        const resultado = await Usuario.update(
            { contrasena: hashPassword },
            { where: { correo } }
        );

        if (resultado[0] > 0) {
            success.push({ msg: 'Contraseña actualizada correctamente' });
        } else {
            errores.push({ msg: 'No se pudo actualizar la contraseña' });
        }
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        errores.push({ msg: 'Error interno del servidor' });
    }

    return res.render('auth/updateUsuario', { layout: false, errores, success });
};


export { insertUsuario, getUsuario, profileView, updatePassword };