"use client";

import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { ToastContextValue, ToastItem, ToastType } from "@/lib/types/toast";
import { toastService } from "./toast-service";

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  warn: AlertTriangle,
  info: Info,
  error: XCircle,
};

const TOAST_CLASSES: Record<ToastType, string> = {
  success: "alert alert-success text-success-content shadow-lg",
  warn: "alert alert-warning text-warning-content shadow-lg",
  info: "alert alert-info text-info-content shadow-lg",
  error: "alert alert-error text-error-content shadow-lg",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [, startTransition] = useTransition();

  const removeToast = (id: string) => {
    startTransition(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    });
  };

  const showToast = (type: ToastType, message: string, duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = { id, type, message, duration };

    startTransition(() => {
      setToasts((prev) => [...prev, newToast]);
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  useEffect(() => {
    const unsubscribe = toastService.subscribe((toast) => {
      startTransition(() => {
        setToasts((prev) => [...prev, toast]);
      });

      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: ToastContextValue = {
    toasts,
    showToast,
    removeToast,
    success: (message, duration) => showToast("success", message, duration),
    warn: (message, duration) => showToast("warn", message, duration),
    info: (message, duration) => showToast("info", message, duration),
    error: (message, duration) => showToast("error", message, duration),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast toast-top toast-end z-50 p-4 gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type];
          const alertClass = TOAST_CLASSES[toast.type];

          return (
            <div
              key={toast.id}
              className={`${alertClass} pointer-events-auto flex items-center justify-between gap-3 text-sm py-3 px-4 rounded-xl border border-black/5 animate-in fade-in slide-in-from-top-2 duration-200`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 shrink-0" />
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="btn btn-ghost btn-xs btn-circle opacity-70 hover:opacity-100"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
