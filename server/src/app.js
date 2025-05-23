import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import proveedorRoutes from './routes/proveedorRoutes.js';

const app = express();

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to override HTTP methods
app.use(methodOverride('_method'));

// Montar las rutas de proveedores con el prefijo '/proveedores'


export default app;
