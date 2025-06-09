const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./conexion');
const Boletos = require('./models/boletos');

const app = express();

app.use(bodyParser.json());

app.post('/calcular', (req, res) => {
	console.log('hola');
	const datos = req.body;

	Boletos.findOne({
		where: {
			localidad: datos.localidad,
			fecha: datos.fecha
		}
	}).then(boleto => {
		if (!boleto) {
			return res.status(404).json({ error: 'Boleto no encontrado' });
		}

		let precio = boleto.precio;
		const descuento = boleto.descuento;
		const cantidad = datos.cantidad;

		if (datos.esEstudiante) {
			precio = precio - (precio * descuento / 100);
		}

		const total = precio * cantidad;

		res.json({
			total: total
		});
	}).catch(err => {
		res.status(500).json({ error: 'Error al procesar la solicitud' });
	});
});

app.listen(3000, () => {
	console.log('Servidor corriendo');
});
