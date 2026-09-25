export type ToastType = "success" | "warn" | "info" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  warn: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
}
