const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());

// Ruta POST para guardar un alumno
app.post('/alumno', (req, res) => {
    const { cuenta, nombre, promedio, grado, grupo } = req.body;

    // Verificar que todos los campos están presentes
    if (!cuenta || !nombre || promedio === undefined || !grado || !grupo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Crear objeto del alumno
    const alumno = { cuenta, nombre, promedio, grado, grupo };

    // Definir el nombre del archivo donde se guardan los alumnos
    const filePath = path.join(__dirname, 'alumnos.txt');

    // Leer los datos existentes o crear un arreglo vacío
    let alumnos = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        try {
            alumnos = JSON.parse(data);
        } catch (error) {
            alumnos = [];
        }
    }

    // Agregar el nuevo alumno
    alumnos.push(alumno);

    // Guardar todos los alumnos de nuevo en el archivo
    fs.writeFileSync(filePath, JSON.stringify(alumnos, null, 2), 'utf8');

    res.status(201).json({ mensaje: 'Alumno guardado correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});