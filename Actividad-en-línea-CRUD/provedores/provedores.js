const { DataTypes } = require('sequelize');
const sequelize = require('.conexion')

// tabla, campos, validacion timestamp
const provedores = sequelize.define('provedores',{
    id: {type: DataTypes.INTEGER, primaryKey:true},
    nombre: {type: DataTypes.STRING},
    direccion: {type: DataTypes.STRING},
},{timestamps:false})

module.exports = provedores;