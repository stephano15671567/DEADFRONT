"use client";

import { useEffect, useState } from 'react';
import { obtenerActivos } from '@/services/bovedaService';

interface Props {
  refreshTrigger?: number;
}

export default function Dashboard({ refreshTrigger }: Props) {
  const [total, setTotal] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const activos = await obtenerActivos();
      setTotal(activos.length);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error cargando resumen de bóveda', err);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
      <h4 className="text-lg font-semibold text-gray-800">Resumen Bóveda</h4>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">Total de activos</div>
          <div className="text-2xl font-bold text-blue-700">{loading ? '—' : (total ?? '—')}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Última actualización</div>
          <div className="text-sm text-gray-600">{lastUpdated ?? '—'}</div>
        </div>
      </div>
      <div className="mt-3 text-right">
        <button onClick={load} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">Actualizar</button>
      </div>
    </div>
  );
}
