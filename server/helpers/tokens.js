import jwt from 'jsonwebtoken';

//Generador de TOKENS
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

const generarJWT = datos => jwt.sign({ 
    id: datos.id, 
    nombre: datos.nombre, 
    rol: datos.rol, 
    correo: datos.correo, 
    imagen_url: datos.imagen_url 
}, process.env.JWT_SECRET, { expiresIn: '1h' })

export {
    generarId,
    generarJWT
}
