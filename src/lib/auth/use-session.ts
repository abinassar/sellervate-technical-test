"use client";

import { useSyncExternalStore, useCallback } from "react";
import { User } from "@/lib/types/user";
import {
  setSessionUser,
  clearSessionUser,
  SESSION_CHANGE_EVENT_NAME,
} from "./session-storage";

function subscribeToSession(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(SESSION_CHANGE_EVENT_NAME, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SESSION_CHANGE_EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

const emptySubscribe = () => () => {};

export function useSession() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const rawUser = useSyncExternalStore(
    subscribeToSession,
    () => (typeof window !== "undefined" ? window.sessionStorage.getItem("sellervate_session_user") : null),
    () => null
  );

  let user: User | null = null;
  if (isClient && rawUser) {
    try {
      user = JSON.parse(rawUser) as User;
    } catch {
      user = null;
    }
  }

  const login = useCallback((newUser: User) => {
    setSessionUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearSessionUser();
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: !isClient,
    login,
    logout,
  };
}

