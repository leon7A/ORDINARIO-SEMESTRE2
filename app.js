// Paquetes requeridos
const express = require('express')
const clientes = require('./clientes') // Definicion del modelo
const bodyParser = require('body-parser') 
const { where } = require('sequelize')

// Incializacion del app
const app = express()
const puerto = 3000

// Parseo de formato para json del body
app.use(bodyParser.json())

const jwt = require('jsonwebtoken')
const secretKey = 'secret'


// Escucha del puerto 
app.listen(puerto,() =>{
    console.log('Servidor Iniciado')
});

// Rutas 

app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    if (usuario == 'admin' && password == '123') {
        const token = jwt.sign({ usuario }, secretKey, { expiresIn: '1h' })
        res.send(token)
    } else {
        res.sendStatus(404)
    }
})

function verificarToken(req, res, next) { // middleware
    const header = req.header('Authorization') || '';
    const token = header.split(' ')[1];
    if (!token) {
        res.status(401).json({ mensaje: 'token no proporcionado' });
    } else {
        try {
            const payload = jwt.verify(token, secretKey); // extraer la información del token
            next();
        }
        catch {
            res.status(400).json({ mensaje: 'token incorrecto' })
        }
    }
}


app.post('/clientes', verificarToken, async (req,res) =>{ // Crear
    // Obtencion del body 
    const {nombre,correo,telefono,direccion} = req.body;
    
    // Uso de create para crear un nuevo registro 
    const data = await clientes.create({
        nombre,correo,telefono,direccion
    });
    
    // Salida
    res.send(data);
})

app.get('/clientes', verificarToken,  async (req,res) => { // Leer 
    const data = await clientes.findAll(); 
    res.send(data);
})

app.delete('/clientes/:id',verificarToken,  async (req,res) => { // Eliminar
    const data = await clientes.destroy({
        where: {
            id
        }
    })
    res.send(data)
})

app.put('/clientes/:id',verificarToken,async (req,res) => { // Actualizar
    const { nombre, correo, telefono, direccion} = req.body;
    const { id } = req.params;
    const data = await articulos.update({
        nombre,correo,telefono,direccion
    },{
        where: {id}
    })
    res.send(data);
})