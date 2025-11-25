'use client';

import React from 'react';

export default function DevBanner() {
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'development') return null;

  const devUser = process.env.NEXT_PUBLIC_DEV_USER_ID || (typeof window !== 'undefined' ? window.localStorage.getItem('DEV_USER_ID') : 'dev-user-1');
  const devRoles = process.env.NEXT_PUBLIC_DEV_USER_ROLES || (typeof window !== 'undefined' ? window.localStorage.getItem('DEV_USER_ROLES') : 'usuario_titular');

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, background: '#111827', color: '#f8fafc', padding: '8px 12px', borderRadius: 8, zIndex: 9999, boxShadow: '0 4px 14px rgba(0,0,0,0.3)', fontSize: 12 }}>
      <div style={{ fontWeight: 700 }}>DEV MODE</div>
      <div style={{ marginTop: 4 }}>user: <code style={{ color: '#93c5fd' }}>{devUser}</code></div>
      <div style={{ marginTop: 2 }}>roles: <code style={{ color: '#fef3c7' }}>{devRoles}</code></div>
    </div>
  );
}
