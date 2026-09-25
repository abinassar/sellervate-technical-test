import { ToastItem, ToastType } from "@/lib/types/toast";

type ToastListener = (toast: ToastItem) => void;

class ToastService {
  private listeners = new Set<ToastListener>();

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public show(type: ToastType, message: string, duration = 4000): void {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const toast: ToastItem = { id, type, message, duration };
    this.listeners.forEach((listener) => listener(toast));
  }

  public success(message: string, duration?: number): void {
    this.show("success", message, duration);
  }

  public warn(message: string, duration?: number): void {
    this.show("warn", message, duration);
  }

  public info(message: string, duration?: number): void {
    this.show("info", message, duration);
  }

  public error(message: string, duration?: number): void {
    this.show("error", message, duration);
  }
}

export const toastService = new ToastService();
