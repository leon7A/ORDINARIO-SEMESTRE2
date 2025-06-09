const { DataTypes } = require('sequelize');
const sequelize = require('./conexion')

// tabla, campos, validacion timestamp
const empleados = sequelize.define('empleados',{
    id: {type: DataTypes.INTEGER, primaryKey:true},
    nombre: {type: DataTypes.STRING},
    telefono: {type: DataTypes.STRING},
    fecha_nacimiento: {type: DataTypes.STRING},
    sueldo: {type: DataTypes.DOUBLE}
},{timestamps:false})

module.exports = empleados;