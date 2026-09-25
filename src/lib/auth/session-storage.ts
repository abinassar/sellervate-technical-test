import { User } from "@/lib/types/user";

export const SESSION_USER_STORAGE_KEY = "sellervate_session_user";
export const SESSION_CHANGE_EVENT_NAME = "sellervate:session-change";

function emitSessionChangeEvent(user: User | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT_NAME, { detail: user }));
}

export function getSessionUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const rawData = window.sessionStorage.getItem(SESSION_USER_STORAGE_KEY);
    if (!rawData) return null;
    return JSON.parse(rawData) as User;
  } catch {
    return null;
  }
}

export function setSessionUser(user: User): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(SESSION_USER_STORAGE_KEY, JSON.stringify(user));
    emitSessionChangeEvent(user);
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}

export function clearSessionUser(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(SESSION_USER_STORAGE_KEY);
    emitSessionChangeEvent(null);
  } catch {
    // Gracefully handle storage errors
  }
}

export function hasActiveSession(): boolean {
  return getSessionUser() !== null;
}
