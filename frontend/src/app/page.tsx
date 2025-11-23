'use client';

import { useState } from 'react';
import CrearActivoForm from '@/components/CrearActivoForm';
import ListaActivos from '@/components/ListaActivos';
import BarraUsuario from '@/components/BarraUsuario'; // <--- Importar

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleSuccess = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-8 relative">
      {/* Barra de Usuario en la esquina */}
      <BarraUsuario />

      <div className="mb-8 text-center mt-12"> {/* Margen top extra para no chocar */}
        <h1 className="text-4xl font-extrabold text-blue-900">💀 Mi Testamento Digital</h1>
        <p className="text-gray-600 mt-2">Gestiona tu legado de forma segura</p>
      </div>
      
      <div className="w-full max-w-2xl">
         <CrearActivoForm onSuccess={handleSuccess} />
      </div>

      <ListaActivos refreshTrigger={refreshCount} />
    </main>
  );
}