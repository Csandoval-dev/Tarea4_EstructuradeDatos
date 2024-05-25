import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = io('http://localhost:5500');

    useEffect(() => {
        // Manejo de Desconexión
        socket.on('disconnect', () => {
            console.log('Se perdió la conexión con el servidor.');
            // Intentar reconectar automáticamente
            socket.connect();
        });

        // Manejo de Errores
        socket.on('error', (error) => {
            console.error('Error en la conexión del socket:', error);
        });

        return () => {
            // Limpiar Eventos
            socket.off('disconnect');
            socket.off('error');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
