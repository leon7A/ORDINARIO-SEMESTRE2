const express = require('express');
const bodyParser = require('body-parser');
const sueldos = require('./models/sueldos'); 
const { Op } = require('sequelize');

const app = express();
const puerto = 3000;

app.use(bodyParser.json());


app.post('/sueldos/calcular', async (req, res) => {
    try {
        const { tipo, dias } = req.body;

        
        if (!tipo || !dias || dias <= 0) {
            return res.status(400).json({ error: 'Datos inválidos. Se requiere tipo y días > 0' });
        }

       
        const data = await sueldos.findOne({ where: { tipo } });

        if (!data) {
            return res.status(404).json({ error: `No se encontró el tipo de sueldo: ${tipo}` });
        }

        let { sueldoDiario, bonoMensual } = data;

        if (dias < 25) {
            bonoMensual = 0;
        }

        let total = (sueldoDiario * dias) + bonoMensual;

        
        res.json({
            tipo,
            dias,
            sueldoDiario,
            bonoMensual,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.listen(puerto, () => {
    console.log(` Servicio iniciado en http://localhost:${puerto}`);
});
