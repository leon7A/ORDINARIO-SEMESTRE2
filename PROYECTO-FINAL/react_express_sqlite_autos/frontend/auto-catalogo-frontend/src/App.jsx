// auto-catalogo-frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css'; // Estilos generales
import CarItem from './CarItem'; // Componente para cada auto

function App() {
  const [cars, setCars] = useState([]); // Estado para almacenar la lista de autos
  const [newCar, setNewCar] = useState({ make: '', model: '', year: '', price: '' }); // Estado para el formulario de añadir auto
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const API_URL = 'http://localhost:3000/cars'; // URL de tu backend de autos

  // Hook useEffect para cargar los autos al inicio de la aplicación
  useEffect(() => {
    fetchCars();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  // Función para obtener todos los autos desde el backend
  const fetchCars = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCars(data.data); // Actualiza el estado con los datos de los autos
    } catch (error) {
      console.error("Error al obtener los autos:", error);
    }
  };

  // Maneja los cambios en los inputs del formulario "Añadir Auto"
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  // Maneja el envío del formulario para añadir un nuevo auto
  const addCar = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Validaciones básicas del lado del cliente
    if (!newCar.make.trim() || !newCar.model.trim() || !newCar.year || !newCar.price) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envía los datos del nuevo auto al backend
        body: JSON.stringify({
          make: newCar.make,
          model: newCar.model,
          year: parseInt(newCar.year), // Asegúrate de enviar el año como número
          price: parseFloat(newCar.price) // Asegúrate de enviar el precio como número flotante
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Intenta leer el error del backend
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      setCars([...cars, data.data]); // Añade el nuevo auto al estado local
      setNewCar({ make: '', model: '', year: '', price: '' }); // Limpia el formulario
    } catch (error) {
      console.error("Error al añadir el auto:", error);
      alert("Error al añadir el auto: " + error.message);
    }
  };

  // Función para eliminar un auto
  const deleteCar = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Filtra el auto eliminado del estado local
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error("Error al eliminar el auto:", error);
      alert("Error al eliminar el auto: " + error.message);
    }
  };

  // Función para actualizar un auto existente
  const updateCar = async (id, updatedFields) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields), // Envía solo los campos que se desean actualizar
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
      }

      // Actualiza el estado local fusionando los campos actualizados en el auto correspondiente
      setCars(cars.map(car =>
        car.id === id ? { ...car, ...updatedFields } : car
      ));
    } catch (error) {
      console.error("Error al actualizar el auto:", error);
      alert("Error al actualizar el auto: " + error.message);
    }
  };

  // Lógica de filtrado para el buscador (se ejecuta cada vez que 'cars' o 'searchTerm' cambian)
  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) || // Buscar por marca
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) || // Buscar por modelo
    String(car.year).includes(searchTerm) // Buscar por año (convertido a string)
  );

  return (
    <div className="App">
      <h1>Catálogo de Autos</h1>

      {/* Input para el buscador */}
      <input
        type="text"
        placeholder="Buscar auto por marca, modelo o año..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Formulario para añadir un nuevo auto */}
      <form onSubmit={addCar}>
        <input
          type="text"
          name="make"
          placeholder="Marca"
          value={newCar.make}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Modelo"
          value={newCar.model}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Año"
          value={newCar.year}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          step="0.01" // Permite decimales para el precio
          value={newCar.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Añadir Auto</button>
      </form>

      {/* Lista de autos (filtrados si hay término de búsqueda) */}
      <div className="car-list">
        {filteredCars.length === 0 ? (
          <p>No hay autos que coincidan con tu búsqueda o el catálogo está vacío.</p>
        ) : (
          filteredCars.map(car => (
            <CarItem
              key={car.id} // Siempre usar una 'key' única para elementos en listas
              car={car}
              onDelete={deleteCar}
              onUpdate={updateCar} // Pasa la función de actualización al CarItem
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;