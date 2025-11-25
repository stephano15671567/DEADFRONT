import api from './api';

export interface SolicitarActivacionDto {
  usuarioId: string;
  contactoId: string;
  nota?: string;
  evidenciaUrl?: string;
}

export const solicitarActivacion = async (payload: SolicitarActivacionDto) => {
  const res = await api.post('/activacion/solicitar', payload);
  return res.data;
};
