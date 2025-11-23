'use client';

import { useState } from 'react';
import { darSenalVida } from '@/services/vidaService';
import { useAuth } from '@/providers/KeycloakProvider';

export default function PanelVida() {
  const { isLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [frecuencia, setFrecuencia] = useState('3_MESES');

  const handlePing = async () => {
    setLoading(true);
    setMensaje(null);
    try {
      await darSenalVida(frecuencia);
      setMensaje({ tipo: 'success', texto: 'Senal recibida! Tu contador se ha reiniciado.' });
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Error al enviar senal. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isLogin) return null;

  return (
    <div className="w-full max-w-2xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg rounded-xl p-6 border border-blue-100 mb-8 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
        Chequeo de Vida
      </h2>
      <p className="text-gray-600 mb-6">
        Confirma que estas bien para mantener tu boveda segura y privada.
        Si no recibimos senal en el tiempo establecido, se activara el protocolo de legado.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1">Frecuencia de Chequeo</label>
          <select
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
            className="block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="3_MESES">Cada 3 Meses</option>
            <option value="6_MESES">Cada 6 Meses</option>
            <option value="12_MESES">Cada 12 Meses</option>
          </select>
        </div>

        <button
          onClick={handlePing}
          disabled={loading}
          className={`w-full sm:flex-1 py-3 px-6 rounded-lg font-bold text-white shadow-md transition-all transform active:scale-95 flex justify-center items-center gap-2
            ${loading 
              ? 'bg-gray-400 cursor-wait' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'}
          `}
        >
          {loading ? 'Enviando...' : 'Dar Senal de Vida'}
        </button>
      </div>

      {mensaje && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center animate-fade-in
          ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}
        `}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}
