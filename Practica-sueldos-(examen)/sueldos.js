const { DataTypes } = require('sequelize');
const sequelize = require('../conexion')

// tabla, campos, validacion timestamp
const sueldos = sequelize.define('sueldos',{
    id: {type: DataTypes.INTEGER, primaryKey:true},
    tipo: {type: DataTypes.STRING},
    sueldoDiario: {type: DataTypes.DOUBLE},
    bonoMensual: {type: DataTypes.DOUBLE}
},{timestamps:false})

module.exports = sueldos;