import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import loginRoutes from './src/routes/loginRoutes.js';
import distribuidorRoutes from './src/routes/distribuidorRoutes.js';
import Distribuidores from './src/models/distribuidorModel.js';
import colaboradorRoutes from './src/routes/colaboradorRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js'; // Import clienteRoutes
import materiaPrimaRoutes from './src/routes/materiaPrimaRoutes.js'; // Import materiaPrimaRoutes
import Clientes from './src/models/clienteModel.js'; // Import Clientes model
import db from './src/models/main.js';
import cookieParser from 'cookie-parser';
import sequelize from './config/database.js';
import productoRoutes from './src/routes/productoRoutes.js'; // Import productoRoutes
import horarioRoutes from './src/routes/horarioRoutes.js';
import formulacionRoutes from './src/routes/formulacionesRoutes.js';
import supabase from './config/supabaseClient.js';
import multer from 'multer';
import pedidosRoutes from './src/routes/pedidosRoutes.js'; // Import pedidosRoutes
import vacacionesRoutes from './src/routes/vacacionesRoutes.js';
import reportesRoutes from './src/routes/reportesRoutes.js';
import proveedorRoutes from './src/routes/proveedorRoutes.js';
import pagoRoutes from './src/routes/pagoRoutes.js'; // Importa las rutas de pagos
import indexRoutes from './src/routes/indexRoutes.js';
import Rol from './src/models/rol.js';

import identificarUsuario from './middleware/identificarUsuario.js';
import errorLogger from './middleware/errorLogger.js';

const app = express();


app.use(cookieParser());

//EJS ENGINE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '..', 'views'));

app.use(ejsLayouts);

app.set('layout', 'layouts/layout');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

//CONEXIÓN A LA BASE DE DATOS (SIN ALTERAR LAS TABLAS)
db.sequelize.authenticate()
    .then(() => console.log('Conexión exitosa con PostgreSQL'))
    .catch(err => console.error('Error de conexión a la BD:', err));

//Home
app.use('/', loginRoutes); 

app.use(identificarUsuario); // Aplica después para proteger el resto

// Middleware global que pasa el objeto usuario a todas las vistas
app.use(async (req, res, next) => {
    if (req.usuario) {
        // Si el usuario está identificado, obtener el nombre del rol
        try {
            const rol = await Rol.findOne({
                where: {
                    id: req.usuario.rol
                }
            });
            
            // Configurar las variables locales para todas las vistas
            res.locals.usuario = req.usuario;
            res.locals.rol_name = rol ? rol.nombre : 'Usuario';
        } catch (error) {
            console.error('Error al obtener el rol:', error);
            res.locals.usuario = req.usuario;
            res.locals.rol_name = 'Usuario';
        }
    }
    next();
});

app.use('/', indexRoutes);

//Rutas Distribuidores

app.use('/', distribuidorRoutes);

app.get('/distEditar/:id', (req, res) => {
    res.render('distribuidores/distribuidoresEditar', { layout: 'layouts/layout' });
});



//Rutas Materia Prima
app.use('/', materiaPrimaRoutes);

app.get('/materiaPrimaAgregar', (req, res) => {
    res.render('materiaPrimaAgregar', { layout: 'layouts/layout' });
});

app.get('/materiaPrima/editar/:id', (req, res) => {
    res.render('materiaPrimaEditar', { layout: 'layouts/layout' });
});

app.get('/insertar_materia_prima/:id', async (req, res) => {
    res.render('insertar_materia_prima', { layout: 'layouts/layout' });
});


//Rutas Colaboradores
app.use('/', colaboradorRoutes);

app.get('/colabEditar/:id', (req, res) => {
    res.render('colaboradoresEditar');
});

//Rutas Clientes
app.use('/', clienteRoutes);

app.get('/clienteAgregar', (req, res) => {
    res.render('clientes/clientesAgregar', { layout: 'layouts/layout' });
});

app.get('/clienteEditar/:id', async (req, res) => {
    try {
        const cliente = await Clientes.findByPk(req.params.id);
        if (cliente) {
            res.render('clientes/clientesEditar', { cliente, layout: 'layouts/layout' });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error fetching client:', error);
        res.redirect('/');
    }
});

//Rutas Producto
app.use('/', productoRoutes);

app.get('/producto/agregar', (req, res) => {
    res.render('productoAgregar', { layout: 'layouts/layout' });
});

app.get('/producto/editar/:id', (req, res) => {
    res.render('productoEditar', { layout: 'layouts/layout' });
});

// Rutas Horarios
app.use('/', horarioRoutes);

//Rutas Formulaciones
app.use('/', formulacionRoutes);

//Rutas Pedidos
app.use('/', pedidosRoutes); // Ensure the correct path is used

// Rutas Solicitudes Vacaciones
app.use('/', vacacionesRoutes);

//Rutas Proveedores
app.use('/proveedores', proveedorRoutes); // Add routes for proveedores
app.use('/pagos', pagoRoutes);
//Rutas de Reportes
app.use('/', reportesRoutes);

//Middleware global para el manejo de errores
app.use(errorLogger);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



