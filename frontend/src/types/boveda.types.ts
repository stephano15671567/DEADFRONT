export type CategoriaActivo = 'RED_SOCIAL' | 'BANCO' | 'EMAIL' | 'OTRO';

// El backend devuelve el ID dentro de un ValueObject
export interface ActivoDigital {
  id: { value: string };
  plataforma: string;
  usuarioCuenta: string;
  passwordCifrada: string;
  notas: string;
  categoria: CategoriaActivo;
  gestionado: boolean;
}

export interface AgregarActivoDto {
  plataforma: string;
  usuarioCuenta: string;
  password: string;
  notas?: string;
  categoria: CategoriaActivo;
}
