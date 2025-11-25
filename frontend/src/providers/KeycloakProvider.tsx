'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import keycloak from '@/lib/keycloak';

interface AuthContextType {
  isLogin: boolean;
  token: string | undefined;
  username: string | undefined;
  userId?: string | undefined;
  roles?: string[];
  login: () => void;
  logout: () => void;
  register: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[] | undefined>(undefined);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const initKeycloak = async () => {
      // If Keycloak is not configured in env (dev), provide a lightweight fallback
      const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
      if (!keycloakUrl) {
        // Development fallback: mark user as logged-in according to env/localStorage
        try {
          const devUser = window.localStorage.getItem('DEV_USER_ID') || 'dev-user';
          const devRoles = (window.localStorage.getItem('DEV_USER_ROLES') || 'usuario_titular').split(',').map(r => r.trim());
          setIsLogin(true);
          setToken(window.localStorage.getItem('kc_token') || undefined);
          setUserId(devUser);
          setRoles(devRoles);
        } catch (err) {
          // If localStorage is inaccessible, just continue without breaking the app
          console.warn('Dev Keycloak fallback could not read localStorage:', err?.message || err);
        }
        return;
      }

      try {
        // Prepare init options. Avoid login iframe checks by default to prevent
        // "Error while checking login iframe" when the redirect HTML is not present.
        const opts: any = {
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          checkLoginIframe: false, // disable iframe polling to avoid the console error when not needed
        };

        // Only set silentCheckSsoRedirectUri if the helper file exists on the server
        try {
          const resp = await fetch(window.location.origin + '/silent-check-sso.html', { method: 'HEAD' });
          if (resp && resp.ok) {
            opts.silentCheckSsoRedirectUri = window.location.origin + '/silent-check-sso.html';
          }
        } catch (err) {
          // ignore — file not present
        }

        const authenticated = await keycloak.init(opts);
        setIsLogin(authenticated);

        if (authenticated) {
          setToken(keycloak.token);
          setUsername(keycloak.tokenParsed?.preferred_username);
          setUserId((keycloak.tokenParsed as any)?.sub);
          const realmRoles = (keycloak.tokenParsed as any)?.realm_access?.roles || [];
          setRoles(realmRoles);

          if (keycloak.token) {
            try { localStorage.setItem('kc_token', keycloak.token); } catch (err) { /* ignore */ }
          }
        }

        const refreshInterval = setInterval(() => {
          keycloak.updateToken(30).then((refreshed: boolean) => {
            if (refreshed) {
              setToken(keycloak.token);
              setUserId((keycloak.tokenParsed as any)?.sub);
              setRoles((keycloak.tokenParsed as any)?.realm_access?.roles || []);
              try { if (keycloak.token) localStorage.setItem('kc_token', keycloak.token); } catch (err) { /* ignore */ }
            }
          }).catch((err: any) => {
            console.warn('Keycloak token refresh failed:', err);
          });
        }, 20 * 1000);

        return () => clearInterval(refreshInterval);
      } catch (error) {
        // Avoid noisy console errors when Keycloak is unreachable; log a friendly message
        console.warn('Keycloak initialization failed (continuing without SSO):', error?.message || error);
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
    <AuthContext.Provider value={{ isLogin, token, username, userId, roles, login, logout, register }}>
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