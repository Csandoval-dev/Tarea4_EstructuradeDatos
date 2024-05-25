import React from 'react';
import Queue from './components/Queue'; // Ruta relativa correcta
import { SocketProvider } from './contexts/SocketContext'; // Ruta relativa correcta

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <header className="App-header">
          <h1>Control de Ingreso y Salida de Usuarios</h1>
          <Queue />
        </header>
      </div>
    </SocketProvider>
  );
}

export default App;
