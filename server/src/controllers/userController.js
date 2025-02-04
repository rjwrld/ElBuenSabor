import Usuario from '../models/usuarios.js'
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt'

const insertUsuario = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    // console.log(nombre, correo, contrasena);

    if (nombre && correo && contrasena) {
        try {
            await Usuario.create({
                nombre: nombre,
                correo: correo,
                contrasena: contrasena,
                rol: "Distribuidor"
            });
            console.log('Usuario creado con éxito');
            res.render('index', {
                usuario: req.body
            })

        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.render('index', {
                usuario: req.body
            })
        }
    } else {
        console.log('Todos los campos son requeridos');
        res.render('index', {
            usuario: req.body
        })
    }
}

const getUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body
        const usuario = await Usuario.findOne({
            where: {
                correo: correo
            }
        });

        if (usuario) {
            console.log(`Usuario ${usuario.correo} encontrado correctamente`);
            res.render('login', {
                layout: false,
                usuario: usuario
            })

        } else {
            console.log(`No se encontró un usuario con el correo: ${correo}`);
            res.render('login', {
                layout: false,
                usuario: usuario,
                mensaje: "No se pudo encontrar al usuario"
            })
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.render('login', {
            layout: false
        });
    }
}



export { insertUsuario, getUsuario };