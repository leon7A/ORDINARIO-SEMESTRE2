const Sequelize = require('sequelize')

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './articulos.db'
})

module.exports = sequelize;