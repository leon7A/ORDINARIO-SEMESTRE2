// auto-catalogo-frontend/src/CarItem.jsx

import React, { useState } from 'react';
import './CarItem.css'; // Estilos específicos para el ítem de auto

function CarItem({ car, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo de edición
  const [editedCar, setEditedCar] = useState(car); // Estado para los datos del auto mientras se edita

  // Maneja los cambios en los inputs del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCar({ ...editedCar, [name]: value });
  };

  // Maneja el clic en el botón "Guardar"
  const handleSaveClick = () => {
    // Validaciones básicas antes de enviar la actualización
    if (!editedCar.make.trim() || !editedCar.model.trim() || !editedCar.year || !editedCar.price) {
        alert('Todos los campos deben estar llenos.');
        return;
    }
    const parsedYear = parseInt(editedCar.year);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
        alert('El año debe ser un número válido (ej. 2023).');
        return;
    }
    const parsedPrice = parseFloat(editedCar.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        alert('El precio debe ser un número positivo.');
        return;
    }

    // Llama a la función onUpdate del componente padre (App.jsx) con el ID y los campos actualizados
    onUpdate(car.id, {
        make: editedCar.make,
        model: editedCar.model,
        year: parsedYear,
        price: parsedPrice
    });
    setIsEditing(false); // Sale del modo de edición
  };

  return (
    <div className="car-item">
      {isEditing ? (
        // Muestra los campos de input cuando está en modo de edición
        <div className="car-details-edit">
          <input
            type="text"
            name="make"
            value={editedCar.make}
            onChange={handleEditInputChange}
            placeholder="Marca"
          />
          <input
            type="text"
            name="model"
            value={editedCar.model}
            onChange={handleEditInputChange}
            placeholder="Modelo"
          />
          <input
            type="number"
            name="year"
            value={editedCar.year}
            onChange={handleEditInputChange}
            placeholder="Año"
          />
          <input
            type="number"
            name="price"
            step="0.01" // Permite números decimales para el precio
            value={editedCar.price}
            onChange={handleEditInputChange}
            placeholder="Precio"
          />
        </div>
      ) : (
        // Muestra los detalles del auto cuando NO está en modo de edición
        <div className="car-details">
          <h3>{car.make} {car.model}</h3>
          <p>Año: {car.year}</p>
          <p>Precio: ${car.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      )}

      <div className="car-actions">
        {isEditing ? (
          // Botones "Guardar" y "Cancelar" en modo de edición
          <>
            <button onClick={handleSaveClick} className="save-button">Guardar</button>
            {/* Al cancelar, restablece los datos editados a los originales del auto */}
            <button onClick={() => { setIsEditing(false); setEditedCar(car); }} className="cancel-button">Cancelar</button>
          </>
        ) : (
          // Botón "Editar" en modo de visualización
          <button onClick={() => setIsEditing(true)} className="edit-button">Editar</button>
        )}
        {/* Botón "Eliminar" siempre visible */}
        <button onClick={() => onDelete(car.id)} className="delete-button">Eliminar</button>
      </div>
    </div>
  );
}

export default CarItem;