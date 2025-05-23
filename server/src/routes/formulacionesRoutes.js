import express from 'express';
import { renderizaForm, guardarFormulacion, getVistaFormulaciones } from '../controllers/formulacionesController.js';

const router = express.Router();

router.get('/formulaciones',getVistaFormulaciones);
router.get('/agregarForms', renderizaForm);
router.post('/guardar-formulacion', guardarFormulacion);


export default router;
