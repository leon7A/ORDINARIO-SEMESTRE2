const { DataTypes } = require('sequelize');
const sequelize = require('./conexion')

// tabla, campos, validacion timestamp
const clientes = sequelize.define('clientes',{
    id: {type: DataTypes.INTEGER, primaryKey:true},
    nombre: {type: DataTypes.STRING},
    correo: {type: DataTypes.STRING},
    telefono: {type: DataTypes.STRING},
    direccion: {type: DataTypes.STRING}
},{timestamps:false})

module.exports = clientes;