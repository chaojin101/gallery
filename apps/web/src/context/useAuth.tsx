"use client";

import { authHeaderSchema } from "@gallery/common";
import { JWT, JWTPayloadSchema } from "@gallery/common/lib/jwt";
import { Value } from "@sinclair/typebox/value";
import { Static } from "elysia";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const LOCALSTORE_TOKEN_KEY = "token";

type TokenPayload = Static<typeof JWTPayloadSchema>;

type AuthHeader = Static<typeof authHeaderSchema>;

type AuthContextType = {
  tokenPayload: TokenPayload;
  authHeader: AuthHeader;
  setAuthToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authHeader, setAuthHeader] = useState<AuthHeader>(
    Value.Create(authHeaderSchema)
  );
  const [tokenPayload, setTokenPayload] = useState<TokenPayload>(
    Value.Create(JWTPayloadSchema)
  );

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORE_TOKEN_KEY);
    if (!token) {
      return;
    }

    setAuthHeader({ Authorization: `Bearer ${token}` });

    const tokenPayload = JWT.decode({ token });
    setTokenPayload(tokenPayload);
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem(LOCALSTORE_TOKEN_KEY, token);

    setAuthHeader({ Authorization: `Bearer ${token}` });

    const tokenPayload = JWT.decode({ token });
    setTokenPayload(tokenPayload);
  };

  const logout = () => {
    localStorage.removeItem(LOCALSTORE_TOKEN_KEY);
    setAuthHeader(Value.Create(authHeaderSchema));
    setTokenPayload(Value.Create(JWTPayloadSchema));
  };

  return (
    <AuthContext.Provider
      value={{
        authHeader,
        tokenPayload,
        setAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
