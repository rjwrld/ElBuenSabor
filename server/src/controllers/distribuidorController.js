import Distribuidores from "../models/distribuidorModel.js";


//Metodo para agregar un distribuidor
const insertDistribuidor = async (req, res) => {
    try {
        const { usuario_id, empresa, telefono, direccion, zona_cobertura } = req.body;

        if (!usuario_id || !empresa) {
            return res.status(400).json({ message: "Usuario ID y Empresa son obligatorios" });
        }

        await Distribuidores.create({
            usuario_id,
            empresa,
            telefono,
            direccion,
            zona_cobertura,
            estado: true
        });

        console.log('Distribuidor creado con éxito');
        res.redirect('/distribuidor');

    } catch (error) {
        console.error('Error al crear el distribuidor:', error);
        res.status(500).json({ message: "Error al agregar distribuidor", error: error.message });
    }
};




//Metodo para obtener los distribuidores almacenados y cargar las direcciones para el select

const getDistribuidor = async (req, res) => {
    try {
       
        const direcciones = await Distribuidores.findAll({
            attributes: ['direccion'],
            group: ['direccion'],
            raw: true 
        });

      
        const distribuidores = await Distribuidores.findAll();

        
        if (distribuidores.length > 0) {
            console.log(`Se encontraron ${distribuidores.length} distribuidores.`);
            res.render('distribuidores', {
                layout: 'layouts/layout',
                distribuidores,
                direcciones, 
                filtroDireccion: "",
                mensaje: null
            });
        } else {
            console.log(`No se encontraron distribuidores.`);
            res.render('distribuidores', {
                layout: 'layouts/layout',
                distribuidores: [],
                direcciones,
                filtroDireccion: "",
                mensaje: "No hay distribuidores registrados."
            });
        }

    } catch (error) {
        console.error('Error al obtener distribuidores:', error);
        res.render('distribuidores', {
            layout: 'layouts/layout',
            distribuidores: [],
            direcciones: [],
            filtroDireccion: "",
            mensaje: "Error al cargar los distribuidores."
        });
    }
};





//Metodo para actualizar los datos de un distribuidor
const updateDistribuidor = async (req, res) => {
    try {
        const { usuario_id, empresa, telefono, direccion, zona_cobertura } = req.body;
        const { id } = req.params;

        if (!id || !usuario_id || !empresa) {
            return res.status(400).json({ message: "ID, Usuario ID y Empresa son obligatorios" });
        }

        const distribuidor = await Distribuidores.findByPk(id);
        if (!distribuidor) {
            return res.status(404).json({ message: "Distribuidor no encontrado" });
        }

        await distribuidor.update({
            usuario_id,
            empresa,
            telefono,
            direccion,
            zona_cobertura
        });

        console.log('Distribuidor actualizado con éxito');
        res.redirect('/distribuidor');

    } catch (error) {
        console.error('Error al actualizar el distribuidor:', error);
        res.status(500).json({ message: "Error al actualizar distribuidor", error: error.message });
    }
};

//Metodo para renderizar la vista de actualizar los distribuidores y que carga los datos del distribuidor a actualizar
const rendUpdateDistribuidor = async (req, res) => {
    try {
        console.log("ID recibido:", req.params.id);

        const distribuidor = await Distribuidores.findByPk(req.params.id);

        if (!distribuidor) {
            console.log("Distribuidor no encontrado en la base de datos");
            return res.status(404).send("Distribuidor no encontrado");
        }

        console.log("Distribuidor seleccionado:", JSON.stringify(distribuidor, null, 2));

        res.render('distribuidoresEditar', {
            distribuidor: distribuidor
        });

    } catch (error) {
        console.error("Error al obtener el distribuidor:", error);
        res.status(500).send("Error interno del servidor");
    }
};


//Metodo para cambiar el estado de un distribuidor
const cambiarDistribuidorEstado = async (req, res) => {
    try {
        const { id } = req.params;

        const distribuidor = await Distribuidores.findByPk(id);
        if (!distribuidor) {
            return res.status(404).json({ message: "Distribuidor no encontrado" });
        }


        distribuidor.estado = !distribuidor.estado;
        await distribuidor.save();

        console.log(`El distribuidor de ID ${id} está ${distribuidor.estado ? 'Activo' : 'Inactivo'}`);

        res.redirect('/distribuidor');

    } catch (error) {
        console.error("Error al cambiar el estado del distribuidor:", error);
        res.status(500).json({ message: "Error al actualizar estado", error: error.message });
    }
};



//Metodo para filtrar los distribuidores por direccion
const filtroDireccionDistribuidores  = async (req, res) => {
    try {
       
        const direcciones = await Distribuidores.findAll({
            attributes: ['direccion'],
            group: ['direccion'],
            raw: true
        });

        const filtroDireccion = req.query.direccion || "";

        const whereCondition = filtroDireccion ? { direccion: filtroDireccion } : {};

        const distribuidores = await Distribuidores.findAll({
            where: whereCondition
        });

        console.log(`Se encontraron ${distribuidores.length} distribuidores con dirección ${filtroDireccion}.`);

        res.render('distribuidores', {
            layout: 'layouts/layout',
            distribuidores,
            direcciones,
            filtroDireccion,
            mensaje: distribuidores.length > 0 ? null : "No hay distribuidores con esta dirección."
        });

    } catch (error) {
        console.error('Error al filtrar distribuidores:', error);
        res.render('distribuidores', {
            layout: 'layouts/layout',
            distribuidores: [],
            direcciones: [],
            filtroDireccion: "",
            mensaje: "Error al cargar los distribuidores."
        });
    }
};






export { insertDistribuidor, getDistribuidor, updateDistribuidor, rendUpdateDistribuidor, cambiarDistribuidorEstado, filtroDireccionDistribuidores };