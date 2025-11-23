export type CategoriaActivo = 'RED_SOCIAL' | 'BANCO' | 'EMAIL' | 'OTRO';

export interface AgregarActivoDto {
  plataforma: string;
  usuarioCuenta: string;
  password: string;
  notas?: string;
  categoria: CategoriaActivo;
}
