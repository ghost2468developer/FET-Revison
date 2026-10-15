import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GQL_ME } from "./gql";
import { getToken, setToken } from "./api";
import type { User } from "./types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  /** true once we know whether we're in (no token, or me resolved) */
  ready: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  ready: false,
  login: () => {},
  logout: () => {},
});

interface MeData {
  me: User | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const { data, loading } = useQuery<MeData>(GQL_ME, {
    skip: !token,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const user = data?.me ?? null;
  const ready = !token || !loading || !!data;

  useEffect(() => {
    // Token existed but the server says we're anonymous (expired/invalid) → clear.
    if (token && !loading && data && !data.me) {
      setToken(null);
      setTokenState(null);
    }
  }, [token, loading, data]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading: !ready,
      ready,
      login: (t: string) => {
        setToken(t);
        setTokenState(t);
      },
      logout: () => {
        setToken(null);
        setTokenState(null);
        window.location.replace("/login");
      },
    }),
    [user, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
