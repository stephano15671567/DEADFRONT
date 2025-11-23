'use client';

import { useState } from 'react';
import { crearActivo } from '@/services/bovedaService';
import { AgregarActivoDto, CategoriaActivo } from '@/types/boveda.types';

export default function CrearActivoForm() {
  const [form, setForm] = useState<AgregarActivoDto>({
    plataforma: '',
    usuarioCuenta: '',
    password: '',
    notas: '',
    categoria: 'OTRO',
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      await crearActivo(form);
      setMensaje({ tipo: 'success', texto: 'Activo guardado correctamente' });
      setForm({ plataforma: '', usuarioCuenta: '', password: '', notas: '', categoria: 'OTRO' });
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar. Revisa el backend.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200 text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Nuevo Activo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Plataforma</label>
          <input
            name="plataforma"
            type="text"
            required
            placeholder="Netflix, Facebook..."
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            value={form.plataforma}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input
            name="usuarioCuenta"
            type="text"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            value={form.usuarioCuenta}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <select
            name="categoria"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="OTRO">Otro</option>
            <option value="RED_SOCIAL">Red Social</option>
            <option value="BANCO">Banco</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-bold transition-colors
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

        {mensaje && (
          <div className={`p-2 text-center rounded ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  );
}