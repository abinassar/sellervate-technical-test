"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User as UserIcon, Shield, Sparkles } from "lucide-react";
import { User } from "@/lib/types/user";
import { toastService } from "@/lib/toast";
import { setSessionUser } from "@/lib/auth/session-storage";

interface SignInCardProps {
  users: User[];
}

export function SignInCard({ users }: SignInCardProps) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const selectedUser = users.find((user) => user.id === selectedUserId);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || isLoading) return;

    setIsLoading(true);

    const randomDelayMs = Math.floor(Math.random() * 1500) + 1200;
    await new Promise((resolve) => setTimeout(resolve, randomDelayMs));

    setSessionUser(selectedUser);
    toastService.success(`¡Bienvenido/a, ${selectedUser.name} ${selectedUser.lastname}!`);

    startTransition(() => {
      router.push("/home");
    });
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div className="card-body gap-6 p-6 sm:p-8">
        <header className="flex flex-col items-center text-center gap-3">
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl ring-8 ring-primary/5">
            <LogIn className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Iniciar Sesión</h1>
            <p className="text-sm opacity-70 mt-1">Selecciona tu usuario canónico para continuar</p>
          </div>
        </header>

        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
          <fieldset className="fieldset">
            <legend className="fieldset-legend font-medium flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-primary" />
              Usuario del Sistema
            </legend>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isLoading || users.length === 0}
              className="select select-bordered w-full"
              aria-label="Seleccionar usuario"
            >
              <option value="" disabled>
                {users.length === 0 ? "No hay usuarios registrados" : "-- Selecciona un usuario --"}
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.lastname} {user.role ? `• ${user.role.name}` : ""}
                </option>
              ))}
            </select>
          </fieldset>

          {selectedUser && (
            <div className="bg-base-200/80 p-3.5 rounded-xl border border-base-300 flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-semibold text-base-content/80">Rol asignado:</span>
              </div>
              <span className="badge badge-primary badge-sm font-medium">
                {selectedUser.role?.name ?? selectedUser.idRole}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedUserId || isLoading}
            className="btn btn-primary w-full shadow-md gap-2"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
