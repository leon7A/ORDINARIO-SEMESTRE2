const sequelize = require('../conexion');
const { DataTypes } = require('sequelize');

const Boletos = sequelize.define('boletos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    localidad: {
        type: DataTypes.STRING,
    },
    fecha: {
        type: DataTypes.STRING, 
    },
    precio: {
        type: DataTypes.DOUBLE,
    },
    descuento: {
        type: DataTypes.DOUBLE, 
    }
}, {
    timestamps: false
});

module.exports = Boletos;
