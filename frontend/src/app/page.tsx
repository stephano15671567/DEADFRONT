'use client';

import { useState } from 'react';
import CrearActivoForm from '@/components/CrearActivoForm';
import ListaActivos from '@/components/ListaActivos';
import BarraUsuario from '@/components/BarraUsuario';
import PanelVida from '@/components/PanelVida';
import ListaContactos from '@/components/ListaContactos'; // <--- IMPORTANTE

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleSuccess = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-8 relative">
      <BarraUsuario />

      <div className="w-full max-w-6xl flex flex-col items-center mt-16">
        
        {/* Cabecera */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
            💀 Mi Testamento Digital
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Tu legado, seguro y organizado para el futuro.</p>
        </div>

        {/* 1. Chequeo de Vida */}
        <PanelVida />

        <div className="w-full border-t border-gray-200 my-10"></div>

        {/* 2. Bóveda */}
        <div className="w-full mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
            🔐 Bóveda Digital
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3">
              <CrearActivoForm onSuccess={handleSuccess} />
            </div>
            <div className="w-full lg:w-2/3">
              <ListaActivos refreshTrigger={refreshCount} />
            </div>
          </div>
        </div>

        <div className="w-full border-t border-gray-200 my-10"></div>

        {/* 3. Contactos Clave (NUEVO) */}
        <div className="w-full mb-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 border-l-4 border-indigo-500 pl-3">
            👥 Contactos Clave
          </h2>
          <p className="text-gray-500 mb-6 text-sm ml-4">
            Personas de confianza que recibirán acceso a tu bóveda si el chequeo de vida falla.
          </p>
          
          <ListaContactos />
        </div>

      </div>
    </main>
  );
}