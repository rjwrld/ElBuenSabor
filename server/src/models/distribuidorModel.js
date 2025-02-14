import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Distribuidores = sequelize.define('Distribuidores', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    empresa: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    zona_cobertura: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    estado: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true 
    }
}, {
    tableName: 'distribuidores', 
    timestamps: false 
});

export default Distribuidores;
