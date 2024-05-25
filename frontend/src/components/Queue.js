import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from '../contexts/SocketContext';

const Queue = () => {
  const [userId, setUserId] = useState('');
  const [queue, setQueue] = useState([]);
  const [isServing, setIsServing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    fetchQueue();
    socket.on('queueUpdated', () => {
      fetchQueue();
    });
    return () => socket.off('queueUpdated');
  }, [socket]);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/users');
      setQueue(response.data);
    } catch (error) {
      console.error('Error al obtener la cola de usuarios:', error);
    }
  };

  const addUser = () => {
    if (userId.trim()) {
      socket.emit('addUser', userId.trim());
      setUserId('');
    } else {
      alert('Por favor, ingrese un número de identidad válido.');
    }
  };

  const serveUser = () => {
    if (queue.length > 0) {
      socket.emit('serveUser');
      setIsServing(true);
      setShowModal(true);
    } else {
      alert('No hay usuarios en espera para atender.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsServing(false);
  };

  return (
    <div>
      <h1>Cola de Usuarios</h1>
      <div>
        <input 
          type="text" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          placeholder="Número de Identidad"
        />
        <button onClick={addUser}>Agregar a la Cola</button>
        <button onClick={serveUser}>Atender Usuario</button>
      </div>
      <div>
        <h2>Usuarios en Espera: {queue.length}</h2>
        <h2>{isServing ? "Atendiendo a un usuario" : "Esperando a que se atienda"}</h2>
        <ul>
          {queue.map(user => (
            <li key={user.id}>{user.id}</li>
          ))}
        </ul>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Usuario Atendido</h2>
            <p>El usuario ha sido atendido exitosamente.</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queue;
