"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useI18n } from "@/components/i18n/locale-provider";
import {
  getCurrentUser,
  getAuthErrorMessage,
  isUnauthorizedError,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/lib/auth";
import type {
  AuthUserResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

type AuthContextValue = {
  user: AuthUserResponse | null;
  status: AuthStatus;
  authErrorMessage: string | null;
  refreshUser: () => Promise<AuthUserResponse | null>;
  login: (payload: LoginPayload) => Promise<AuthUserResponse>;
  register: (payload: RegisterPayload) => Promise<AuthUserResponse>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [user, setUser] = useState<AuthUserResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function hydrateUser() {
      try {
        const currentUser = await getCurrentUser();
        if (!isActive) {
          return;
        }
        setUser(currentUser);
        setStatus("authenticated");
        setAuthErrorMessage(null);
      } catch (error) {
        if (!isActive) {
          return;
        }
        setUser(null);
        if (isUnauthorizedError(error)) {
          setStatus("unauthenticated");
          setAuthErrorMessage(null);
          return;
        }

        setStatus("error");
        setAuthErrorMessage(
          getAuthErrorMessage(
            error,
            t("guard.sessionUnavailableDescription"),
          ),
        );
      }
    }

    void hydrateUser();

    return () => {
      isActive = false;
    };
  }, [t]);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
      setAuthErrorMessage(null);
      return currentUser;
    } catch (error) {
      setUser(null);
      if (isUnauthorizedError(error)) {
        setStatus("unauthenticated");
        setAuthErrorMessage(null);
        return null;
      }

      setStatus("error");
      setAuthErrorMessage(
        getAuthErrorMessage(error, t("guard.sessionUnavailableDescription")),
      );
      return null;
    }
  }

  async function login(payload: LoginPayload) {
    setAuthErrorMessage(null);
    const currentUser = await loginRequest(payload);
    setUser(currentUser);
    setStatus("authenticated");
    setAuthErrorMessage(null);
    return currentUser;
  }

  async function register(payload: RegisterPayload) {
    setAuthErrorMessage(null);
    const currentUser = await registerRequest(payload);
    setUser(currentUser);
    setStatus("authenticated");
    setAuthErrorMessage(null);
    return currentUser;
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    setStatus("unauthenticated");
    setAuthErrorMessage(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        authErrorMessage,
        refreshUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
