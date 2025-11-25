"use client";

import { useState } from 'react';
import { solicitarActivacion } from '@/services/activacionService';
import { useAuth } from '@/providers/KeycloakProvider';

export default function SolicitarActivacion() {
  const { isLogin, roles } = useAuth();
  const [form, setForm] = useState({ usuarioId: '', contactoId: '', nota: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      setMensaje({ tipo: 'error', texto: 'Debes iniciar sesión para solicitar activación.' });
      return;
    }
    if (!roles || !roles.includes('contacto_clave')) {
      setMensaje({ tipo: 'error', texto: 'Solo contactos clave pueden solicitar activación.' });
      return;
    }

    setLoading(true);
    setMensaje(null);
    try {
      await solicitarActivacion({ usuarioId: form.usuarioId, contactoId: form.contactoId, nota: form.nota });
      setMensaje({ tipo: 'success', texto: 'Solicitud enviada correctamente.' });
      setForm({ usuarioId: '', contactoId: '', nota: '' });
    } catch (err: any) {
      console.error('Error solicitando activacion', err);
      setMensaje({ tipo: 'error', texto: err?.response?.data?.error || 'Error al enviar solicitud' });
    } finally {
      setLoading(false);
    }
  };

  if (!isLogin) return null;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 mt-6">
      <h4 className="font-semibold text-gray-800 mb-2">Solicitar Activación Manual</h4>
      <p className="text-sm text-gray-500 mb-3">Solo usuarios con rol <strong>contacto_clave</strong> pueden enviar esta solicitud.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">ID del titular (usuarioId)</label>
          <input name="usuarioId" value={form.usuarioId} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Tu ID de contacto (contactoId)</label>
          <input name="contactoId" value={form.contactoId} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Nota (opcional)</label>
          <textarea name="nota" value={form.nota} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className={`py-2 px-4 rounded font-semibold text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>

        {mensaje && (
          <div role="status" aria-live="polite" className={`p-2 text-sm rounded ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  );
}
