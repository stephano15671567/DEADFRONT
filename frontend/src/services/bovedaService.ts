import api from './api';
import { AgregarActivoDto } from '../types/boveda.types';

export const crearActivo = async (datos: AgregarActivoDto) => {
  const response = await api.post('/boveda/activos', datos);
  return response.data;
};
