// Paquetes requeridos
const express = require('express')
const empleados = require('./empleados') // Definicion del modelo
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
app.post('/empleados', async (req,res) =>{ // Crear
    // Obtencion del body 
    const {nombre,telefono,fecha_nacimiento,sueldo} = req.body;
    
    // Uso de create para crear un nuevo registro 
    const data = await empleados.create({
        nombre,telefono,fecha_nacimiento,sueldo
    });
    
    // Salida
    res.send(data);
})

app.get('/empleados', async (req,res) => { // Leer 
    const data = await empleados.findAll(); 
    res.send(data);
})

app.delete('/empleados/:id', async (req,res) => { // Eliminar
    const data = await empleados.destroy({
        where: {
            id
        }
    })
    res.send(data)
})

app.put('/empleados/:id',async (req,res) => { // Actualizar
    const { nombre,telefono,fecha_nacimiento,sueldo} = req.body;
    const { id } = req.params;
    const data = await empleados.update({
        nombre,telefono,fecha_nacimiento,sueldo
    },{
        where: {id}
    })
    res.send(data);
})