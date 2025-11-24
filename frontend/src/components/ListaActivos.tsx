'use client';

import { useEffect, useState } from 'react';
import { obtenerActivos, eliminarActivo } from '@/services/bovedaService';
import { ActivoDigital } from '@/types/boveda.types';
import { useAuth } from '@/providers/KeycloakProvider'; // <--- IMPORTAR

interface Props {
  refreshTrigger: number;
}

export default function ListaActivos({ refreshTrigger }: Props) {
  const { isLogin, token, roles } = useAuth(); // <--- USAR EL HOOK
  const [activos, setActivos] = useState<ActivoDigital[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const cargarDatos = async () => {
    if (!isLogin || !token) return; // SI NO HAY LOGIN, NO HACER NADA

    setLoading(true);
    try {
      const data = await obtenerActivos();
      setActivos(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error cargando activos", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar cuando cambie el trigger O cuando el usuario se loguee
  useEffect(() => {
    if (isLogin) {
      cargarDatos();
    } else {
      setActivos([]); // Limpiar si se desloguea
    }
  }, [refreshTrigger, isLogin, token]);

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este activo?')) return;
    try {
      await eliminarActivo(id);
      cargarDatos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  // Renderizado condicional: solo titular puede ver activos
  if (!isLogin || !(roles || []).includes('usuario_titular')) {
    return (
      <div className="w-full max-w-5xl mt-8 text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">🔒 Acceso restringido: necesitas el rol de titulado para ver esta bóveda.</p>
      </div>
    );
  }

  if (loading) return <p className="text-center text-gray-500 mt-8">Cargando bóveda...</p>;
  if (activos.length === 0) return <p className="text-center text-gray-500 mt-8">La bóveda está vacía.</p>;

  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">📦 Mis Activos Resguardados</h3>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Total: <span className="font-semibold text-gray-800">{activos.length}</span></div>
          {lastUpdated && <div className="text-xs text-gray-400">Última actualización: {lastUpdated}</div>}
        </div>
      </div>
      <div className="mb-4">
        <input
          placeholder="Buscar por plataforma o usuario..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-200 rounded"
          aria-label="Buscar activos"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activos
          .filter((a) => a.plataforma.toLowerCase().includes(filter.toLowerCase()) || a.usuarioCuenta.toLowerCase().includes(filter.toLowerCase()))
          .map((activo) => (
          <div key={activo.id.value} className="bg-white p-5 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-blue-900 truncate pr-2">{activo.plataforma}</h4>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wide">{activo.categoria}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600"><span className="font-semibold">User:</span> {activo.usuarioCuenta}</p>
                <p className="text-sm text-gray-500 italic truncate">"{activo.notas || "Sin notas"}"</p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs text-gray-400 font-mono bg-gray-50 p-1 rounded">{revealed[activo.id.value] ? activo.passwordCifrada : `${activo.passwordCifrada.substring(0, 8)}••••••`}</code>
                  <button
                    onClick={() => setRevealed((r) => ({ ...r, [activo.id.value]: !r[activo.id.value] }))}
                    className="text-xs text-blue-600 hover:underline"
                    aria-pressed={!!revealed[activo.id.value]}
                  >
                    {revealed[activo.id.value] ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
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