'use client';

import { useState } from 'react';
import { crearActivo } from '@/services/bovedaService';
import { AgregarActivoDto, CategoriaActivo } from '@/types/boveda.types';
import { useAuth } from '@/providers/KeycloakProvider'; // <--- IMPORTAR

interface Props {
  onSuccess?: () => void;
}

export default function CrearActivoForm({ onSuccess }: Props) {
  const { isLogin, roles } = useAuth(); // <--- Verificar estado y roles
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
    if (!isLogin) return; // Protección extra

    setLoading(true);
    setMensaje(null);

    try {
      await crearActivo(form);
      setMensaje({ tipo: 'success', texto: '¡Activo guardado correctamente!' });
      setForm({ plataforma: '', usuarioCuenta: '', password: '', notas: '', categoria: 'OTRO' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar. ¿Estás logueado?' });
    } finally {
      setLoading(false);
    }
  };

  // Si no está logueado o no tiene rol de titular, ocultamos el formulario
  if (!isLogin || !(roles || []).includes('usuario_titular')) return null;

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-6 border border-gray-200 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Nuevo Activo</h2>
      {/* ... (Resto del formulario igual, no cambia nada abajo) ... */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Plataforma</label>
            <input name="plataforma" type="text" required placeholder="Ej: Netflix" className="mt-1 block w-full p-2 border border-gray-300 rounded text-black" value={form.plataforma} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select name="categoria" className="mt-1 block w-full p-2 border border-gray-300 rounded text-black" value={form.categoria} onChange={handleChange}>
              <option value="OTRO">Otro</option>
              <option value="RED_SOCIAL">Red Social</option>
              <option value="BANCO">Banco</option>
              <option value="EMAIL">Email</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input name="usuarioCuenta" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded text-black" value={form.usuarioCuenta} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="mt-1 block w-full p-2 border border-gray-300 rounded text-black" value={form.password} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea name="notas" placeholder="Notas..." className="mt-1 block w-full p-2 border border-gray-300 rounded text-black h-20" value={form.notas} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {loading ? 'Guardando...' : 'Guardar Activo'}
        </button>

        {mensaje && (
          <div className={`p-2 text-center rounded text-sm ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  );
}