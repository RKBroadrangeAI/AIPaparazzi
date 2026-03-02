"use client";

import { createContext, useContext } from "react";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string | null;
}

interface SessionContextType {
  user: SessionUser | null;
}

const SessionContext = createContext<SessionContextType>({ user: null });

export function SessionProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser | null;
}) {
  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
