"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/use-session";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      fallback ?? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-xs text-base-content/60 font-medium animate-pulse">Verificando sesión...</p>
        </div>
      )
    );
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
