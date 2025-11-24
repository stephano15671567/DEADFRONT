'use client';

import { useEffect, useState } from 'react';
import { crearContacto, listarContactos, eliminarContacto } from '@/services/contactosService';
import { ContactoDto } from '@/types/contacto.types';
import { useAuth } from '@/providers/KeycloakProvider';

export default function ListaContactos() {
  const { isLogin, token, roles } = useAuth();
  const [contactos, setContactos] = useState<ContactoDto[]>([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cargar = async () => {
    if (!isLogin || !token) return;
    try {
      const data = await listarContactos();
      setContactos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargar();
  }, [isLogin, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await crearContacto(form);
      setForm({ nombre: '', email: '', telefono: '' });
      cargar();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Borrar contacto?')) return;
    if (!id) return; // Validación extra
    await eliminarContacto(id);
    cargar();
  };

  // Solo el titular puede gestionar contactos
  if (!isLogin || !(roles || []).includes('usuario_titular')) return null;

  const maxAlcanzado = contactos.length >= 5;

  return (
    <div className="w-full max-w-5xl mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex justify-between items-center">
        <span>👥 Contactos Clave (Herederos)</span>
        <span className={`text-sm px-2 py-1 rounded ${maxAlcanzado ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {contactos.length} / 5
        </span>
      </h3>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input 
            placeholder="Nombre" 
            required 
            className="p-2 border rounded text-black"
            value={form.nombre}
            onChange={e => setForm({...form, nombre: e.target.value})}
          />
          <input 
            placeholder="Email" 
            type="email" 
            required 
            className="p-2 border rounded text-black"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <input 
            placeholder="Teléfono" 
            required 
            className="p-2 border rounded text-black"
            value={form.telefono}
            onChange={e => setForm({...form, telefono: e.target.value})}
          />
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
        
        <button 
          type="submit" 
          disabled={loading || maxAlcanzado}
          className={`mt-3 w-full py-2 rounded font-bold text-white transition
            ${maxAlcanzado 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {maxAlcanzado ? 'Límite de contactos alcanzado' : (loading ? 'Guardando...' : 'Agregar Heredero')}
        </button>
      </form>

      {/* Lista */}
      <div className="space-y-2">
        {contactos.map((c: any) => (
          <div key={c.id?.value || Math.random()} className="flex justify-between items-center p-3 bg-white border rounded hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-800">{c.nombre}</p>
              <p className="text-sm text-gray-500">{c.email} | {c.telefono}</p>
            </div>
            <button 
              onClick={() => c.id?.value && handleEliminar(c.id.value)}
              className="text-red-500 hover:bg-red-50 p-2 rounded"
            >
              🗑️
            </button>
          </div>
        ))}
        {contactos.length === 0 && <p className="text-center text-gray-400 italic">No hay contactos designados.</p>}
      </div>
    </div>
  );
}