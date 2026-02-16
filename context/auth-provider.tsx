import React from 'react';
import { useGameAuth } from '@/hooks/useGameAuth';
import { AuthContext } from './auth-context';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useGameAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
