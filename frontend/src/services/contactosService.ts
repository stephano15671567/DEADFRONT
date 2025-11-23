import api from './api';
import { ContactoDto } from '../types/contacto.types';

export const crearContacto = async (datos: ContactoDto) => {
  const response = await api.post('/contactos', datos);
  return response.data;
};

export const listarContactos = async (): Promise<ContactoDto[]> => {
  const response = await api.get('/contactos');
  return response.data;
};

export const eliminarContacto = async (id: string) => {
  const response = await api.delete(`/contactos/${id}`);
  return response.data;
};