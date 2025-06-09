// Paquetes requeridos
const express = require('express')
const provedores = require('./provedores') // Definicion del modelo
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
app.post('/provedores', async (req,res) =>{ // Crear
    // Obtencion del body 
    const {nombre,direccion} = req.body;
    
    // Uso de create para crear un nuevo registro 
    const data = await provedores.create({
        nombre,direccion
    });
    
    // Salida
    res.send(data);
})

app.get('/provedores', async (req,res) => { // Leer 
    const data = await provedores.findAll(); 
    res.send(data);
})

app.delete('/provedores/:id', async (req,res) => { // Eliminar
    const data = await provedores.destroy({
        where: {
            id
        }
    })
    res.send(data)
})

app.put('/provedores/:id',async (req,res) => { // Actualizar
    const { nombre,direccion} = req.body;
    const { id } = req.params;
    const data = await provedores.update({
        nombre,direccion
    },{
        where: {id}
    })
    res.send(data);
})