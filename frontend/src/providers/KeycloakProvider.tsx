'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import keycloak from '@/lib/keycloak';

interface AuthContextType {
  isLogin: boolean;
  token: string | undefined;
  username: string | undefined;
  login: () => void;
  logout: () => void;
  register: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso', // Revisa si ya existe sesión sin forzar login
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html', // Opcional para evitar recargas
          pkceMethod: 'S256', // Estándar de seguridad moderno
        });

        setIsLogin(authenticated);

        if (authenticated) {
          setToken(keycloak.token);
          setUsername(keycloak.tokenParsed?.preferred_username);
          
          // Guardamos el token en localStorage para casos extremos, 
          // aunque lo ideal es consumirlo del contexto o memoria.
          if (keycloak.token) {
            localStorage.setItem('kc_token', keycloak.token);
          }
        }
      } catch (error) {
        console.error('Error inicializando Keycloak:', error);
      }
    };

    initKeycloak();
  }, []);

  const login = () => keycloak.login();
  const logout = () => {
    localStorage.removeItem('kc_token'); // Limpieza
    keycloak.logout();
  };
  const register = () => keycloak.register();

  return (
    <AuthContext.Provider value={{ isLogin, token, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar la autenticación fácil
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un KeycloakProvider');
  }
  return context;
};