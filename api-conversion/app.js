const express = require('express')
const bodyParser = require('body-parser')
const monedas = require('./monedas') // Importar el modelo de la bd
const app = express()
const puerto = 3000

app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})

app.post('/convertir', async (req, res) => {
    const { origen, destino, cantidad } = req.body;
    
    // obtener la información de la base de datos
    const data = await monedas.findOne({
        where: {
            origen, destino
        }
    });

    if (!data) {
        res.sendStatus(404)
    }

    const { valor } = data;
    const resultado = cantidad * valor;

    res.send({
        origen, destino, cantidad, resultado
    })

})

app.post('/modificar', async (req, res) => {
    const { origen, destino, valor } = req.body;


    // obtener la información de la base de datos
    const data = await monedas.findOne({
        where: {
            origen, destino
        }
    });

    // No existe (Agrega en vez de error)
    if (!data) {
        const createConversion = await monedas.create({ origen, destino, valor});
        res.send("Conversion registrada con exito!")
    } // Si existe que lo actualize (Valor actualizado)
    else{
        if (data.valor !== valor) {
            await data.update({ valor });
            return res.json({ mensaje: 'Registro actualizado', data });
          } else {
            return res.send("El valor es el mismo que ya esta registrado")
          }
    }
})


app.get('/monedas', async (req, res) => {
    const data = await monedas.findAll();
    res.send(data);
})