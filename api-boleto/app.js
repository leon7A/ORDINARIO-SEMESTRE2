const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// Precios por sección
const SECTION_PRICES = {
  A: 300,
  B: 490,
  C: 670,
  D: 899
};

// Descuentos
const MULTIPLE_TICKET_DISCOUNT = 0.05; // 5%
const SUNDAY_DISCOUNT = 0.16;          // 16%

app.post('/api/obtener_precio', (req, res) => {
  const { seccion, cantidad, dia } = req.body;

  if (!seccion || !cantidad || !dia) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const seccionMayus = seccion.toUpperCase();
  const diaLower = dia.toLowerCase();

  if (!SECTION_PRICES[seccionMayus]) {
    return res.status(400).json({ error: 'Sección inválida.' });
  }

  if (!['viernes', 'sábado', 'domingo'].includes(diaLower)) {
    return res.status(400).json({ error: 'Día inválido. Debe ser viernes, sábado o domingo.' });
  }

  let precioBase = SECTION_PRICES[seccionMayus];
  let precioTotal = precioBase * cantidad;

  // Descuento por domingo
  if (diaLower === 'domingo') {
    precioTotal *= (1 - SUNDAY_DISCOUNT);
  }

  // Descuento por múltiples boletos
  if (cantidad > 1) {
    precioTotal *= (1 - MULTIPLE_TICKET_DISCOUNT);
  }

  res.json({
    seccion: seccionMayus,
    dia: diaLower,
    cantidad,
    precio_total: Number(precioTotal.toFixed(2))
  });
});

app.listen(3000, () => {
  console.log(`API corriendo en http://localhost:${3000}`);
});
