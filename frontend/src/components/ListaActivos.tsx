'use client';

import { useEffect, useState } from 'react';
import { obtenerActivos, eliminarActivo } from '@/services/bovedaService';
import { ActivoDigital } from '@/types/boveda.types';

interface Props {
  refreshTrigger: number;
}

export default function ListaActivos({ refreshTrigger }: Props) {
  const [activos, setActivos] = useState<ActivoDigital[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await obtenerActivos();
      setActivos(data);
    } catch (error) {
      console.error("Error cargando activos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [refreshTrigger]);

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este activo?')) return;
    try {
      await eliminarActivo(id);
      cargarDatos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  if (loading && activos.length === 0) return <p className="text-center text-gray-500 mt-8">Cargando bóveda...</p>;
  if (!loading && activos.length === 0) return <p className="text-center text-gray-500 mt-8">La bóveda está vacía. ¡Agrega tu primer activo arriba!</p>;

  return (
    <div className="w-full max-w-5xl mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">📦 Mis Activos Resguardados</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activos.map((activo) => (
          <div key={activo.id.value} className="bg-white p-5 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-blue-900 truncate pr-2">{activo.plataforma}</h4>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wide">{activo.categoria}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600"><span className="font-semibold">User:</span> {activo.usuarioCuenta}</p>
                <p className="text-sm text-gray-500 italic truncate">"{activo.notas || "Sin notas"}"</p>
                <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-50 p-1 rounded">{activo.passwordCifrada.substring(0, 20)}...</p>
              </div>
            </div>
            <button 
              onClick={() => handleEliminar(activo.id.value)}
              className="mt-4 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded text-sm font-semibold w-full transition-colors"
            >
              Eliminar Activo 🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}