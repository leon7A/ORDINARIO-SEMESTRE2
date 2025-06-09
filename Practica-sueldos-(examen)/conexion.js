const { Sequelize } = require ('sequelize')//importar sequelize

//crear el objeto de la conexion con la bd con sequelize

const sequelize = new Sequelize({
    dialect: 'sqlite', //tipo de base de datos a utilizar
    storage: './sueldos.sqlite'
})

module.exports = sequelize;