// Paquetes requeridos
const express = require('express')
const clientes = require('./clientes') // Definicion del modelo
const bodyParser = require('body-parser') 
const { where } = require('sequelize')

// Incializacion del app
const app = express()
const puerto = 3003

// Parseo de formato para json del body
app.use(bodyParser.json())

// Escucha del puerto 
app.listen(puerto,() =>{
    console.log('Servidor Iniciado')
});

// Rutas 
app.post('/clientes', async (req,res) =>{ // Crear
    // Obtencion del body 
    const {nombre,correo,telefono,direccion} = req.body;
    
    // Uso de create para crear un nuevo registro 
    const data = await clientes.create({
        nombre,correo,telefono,direccion
    });
    
    // Salida
    res.send(data);
})

app.get('/clientes', async (req,res) => { // Leer 
    const data = await clientes.findAll(); 
    res.send(data);
})

app.delete('/clientes/:id', async (req,res) => { // Eliminar
    const data = await clientes.destroy({
        where: {
            id
        }
    })
    res.send(data)
})

app.put('/clientes/:id',async (req,res) => { // Actualizar
    const { nombre, correo, telefono, direccion} = req.body;
    const { id } = req.params;
    const data = await articulos.update({
        nombre,correo,telefono,direccion
    },{
        where: {id}
    })
    res.send(data);
})