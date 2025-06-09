const Sequelize = require('sequelize')

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './empleados.sqlite'
})

module.exports = sequelize;