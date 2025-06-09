// auto-catalogo-backend/server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Importa el middleware CORS

const app = express();
const port = 3000; // El puerto en el que escuchará tu backend

// Configurar CORS: Permite peticiones desde cualquier origen (para desarrollo)
// Si despliegas, deberías especificar el origen de tu frontend, por ejemplo:
// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Conexión a la base de datos SQLite
// Si el archivo 'autoscatalogo.sqlite' no existe, SQLite lo creará automáticamente.
const db = new sqlite3.Database('./autoscatalogo.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    // Crear tabla 'cars' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,      -- Marca del auto (ej. Toyota)
      model TEXT NOT NULL,     -- Modelo del auto (ej. Corolla)
      year INTEGER NOT NULL,   -- Año del auto (ej. 2020)
      price REAL NOT NULL      -- Precio del auto (ej. 25000.00)
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla "cars":', err.message);
      } else {
        console.log('Tabla "cars" creada o ya existe.');
      }
    });
  }
});

// --- Rutas de la API para el catálogo de autos ---

// 1. Obtener todos los autos (GET /cars)
app.get('/cars', (req, res) => {
  db.all('SELECT * FROM cars', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Autos obtenidos exitosamente',
      data: rows
    });
  });
});

// 2. Obtener un auto por ID (GET /cars/:id)
app.get('/cars/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM cars WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Auto no encontrado' });
      return;
    }
    res.json({
      message: 'Auto obtenido exitosamente',
      data: row
    });
  });
});

// 3. Crear un nuevo auto (POST /cars)
app.post('/cars', (req, res) => {
  const { make, model, year, price } = req.body;
  if (!make || !model || !year || !price) {
    res.status(400).json({ error: 'Todos los campos (make, model, year, price) son requeridos.' });
    return;
  }
  // Validaciones básicas de tipo de datos
  if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
    res.status(400).json({ error: 'El año debe ser un número válido (ej. 2023).' });
    return;
  }
  if (typeof price !== 'number' || price <= 0) {
    res.status(400).json({ error: 'El precio debe ser un número positivo.' });
    return;
  }

  db.run(
    'INSERT INTO cars (make, model, year, price) VALUES (?, ?, ?, ?)',
    [make, model, year, price],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        message: 'Auto creado exitosamente',
        data: { id: this.lastID, make, model, year, price }
      });
    }
  );
});

// 4. Actualizar un auto existente (PUT /cars/:id)
app.put('/cars/:id', (req, res) => {
  const id = req.params.id;
  const { make, model, year, price } = req.body;

  let updates = [];
  let params = [];

  if (make !== undefined) {
    updates.push('make = ?');
    params.push(make);
  }
  if (model !== undefined) {
    updates.push('model = ?');
    params.push(model);
  }
  if (year !== undefined) {
    if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
        res.status(400).json({ error: 'El año debe ser un número válido.' });
        return;
    }
    updates.push('year = ?');
    params.push(year);
  }
  if (price !== undefined) {
    if (typeof price !== 'number' || price <= 0) {
        res.status(400).json({ error: 'El precio debe ser un número positivo.' });
        return;
    }
    updates.push('price = ?');
    params.push(price);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar (make, model, year, price).' });
    return;
  }

  params.push(id); // El ID siempre va al final para el WHERE

  const sql = `UPDATE cars SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Auto no encontrado para actualizar' });
      return;
    }
    res.json({
      message: 'Auto actualizado exitosamente',
      changes: this.changes
    });
  });
});

// 5. Eliminar un auto (DELETE /cars/:id)
app.delete('/cars/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM cars WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Auto no encontrado para eliminar' });
      return;
    }
    res.json({
      message: 'Auto eliminado exitosamente',
      changes: this.changes
    });
  });
});


// Iniciar el servidor Express
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

// Manejo de cierre de conexión a la base de datos (buena práctica)
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexión a la base de datos SQLite cerrada.');
    process.exit(0);
  });
});