import api from './api';

export const darSenalVida = async (frecuencia?: string) => {
  // Enviamos la frecuencia solo si el usuario quiere cambiarla
  const body = frecuencia ? { frecuencia } : {};
  const response = await api.post('/vida/ping', body);
  return response.data;
};
