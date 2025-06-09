const Sequelize = require('sequelize')

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './provedores.sqlite'
})

module.exports = sequelize;