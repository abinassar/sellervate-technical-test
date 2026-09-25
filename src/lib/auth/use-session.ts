"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import { User } from "@/lib/types/user";
import {
  getSessionUser,
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

export function useSession() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rawUser = useSyncExternalStore(
    subscribeToSession,
    () => (typeof window !== "undefined" ? window.sessionStorage.getItem("sellervate_session_user") : null),
    () => null
  );

  const user = isMounted && rawUser ? (JSON.parse(rawUser) as User) : isMounted ? getSessionUser() : null;

  const login = useCallback((newUser: User) => {
    setSessionUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearSessionUser();
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: !isMounted,
    login,
    logout,
  };
}
