"use client";

import { decodeToken } from "@/lib/utils";
import { JWTPayload } from "@gallery/backend";
import jwt from "jsonwebtoken";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const LOCALSTORE_TOKEN_KEY = "token";

type JWTState = JWTPayload & jwt.Jwt;

type AuthHeader = {
  authorization: string;
};

type AuthContextType = {
  tokenPayload: JWTState | null;
  authHeader: AuthHeader | null;
  setAuthToken: (token: string) => void;
  setTokenPayload: (payload: JWTState) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authHeader, setAuthHeader] = useState<AuthHeader | null>(null);
  const [tokenPayload, setTokenPayload] = useState<JWTState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORE_TOKEN_KEY);
    if (!token) {
      setIsReady(true);
      return;
    }

    const tokenPayload = decodeToken(token);
    setAuthHeader({ authorization: `Bearer ${token}` });
    setTokenPayload(tokenPayload);
    setIsReady(true);
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem(LOCALSTORE_TOKEN_KEY, token);
    const tokenPayload = decodeToken(token);
    setAuthHeader({ authorization: `Bearer ${token}` });
    setTokenPayload(tokenPayload);
  };

  const logout = () => {
    localStorage.removeItem(LOCALSTORE_TOKEN_KEY);
    setAuthHeader(null);
    setTokenPayload(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authHeader,
        tokenPayload,
        setTokenPayload,
        setAuthToken,
        logout,
      }}
    >
      {isReady && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
