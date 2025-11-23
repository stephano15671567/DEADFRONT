'use client';

import { useAuth } from '@/providers/KeycloakProvider';

export default function BarraUsuario() {
  const { isLogin, username, login, logout } = useAuth();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-4">
      {isLogin ? (
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            Hola, <span className="font-bold text-blue-600">{username}</span>
          </span>
          <button
            onClick={logout}
            className="ml-2 text-xs text-red-500 hover:text-red-700 hover:underline font-semibold"
          >
            Salir
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md font-bold transition-all transform hover:scale-105"
        >
          Iniciar Sesión 🔐
        </button>
      )}
    </div>
  );
}