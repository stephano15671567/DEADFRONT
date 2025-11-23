import api from './api';
import { AgregarActivoDto, ActivoDigital } from '../types/boveda.types';

export const crearActivo = async (datos: AgregarActivoDto) => {
  const response = await api.post('/boveda/activos', datos);
  return response.data;
};

export const obtenerActivos = async (): Promise<ActivoDigital[]> => {
  const response = await api.get('/boveda/activos');
  return response.data;
};

export const eliminarActivo = async (id: string) => {
  const response = await api.delete(`/boveda/activos/${id}`);
  return response.data;
};
