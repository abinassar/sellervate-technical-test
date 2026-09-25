"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, ChevronDown, Shield, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth/use-session";
import { toastService } from "@/lib/toast";

interface ToolbarProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Toolbar({
  title = "Sellervate",
  subtitle,
  children,
  className = "",
}: ToolbarProps) {
  const router = useRouter();
  const { user, logout } = useSession();

  const handleSignOut = () => {
    logout();
    toastService.info("Sesión cerrada correctamente.");
    router.push("/sign-in");
  };

  const userInitials = user
    ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <header className={`navbar bg-base-100 border-b border-base-300 px-4 sm:px-8 sticky top-0 z-40 shadow-sm ${className}`}>
      <div className="flex-1 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight leading-tight">{title}</h1>
            {subtitle && <p className="text-xs opacity-60 leading-tight hidden sm:block">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>

      <div className="flex-none flex items-center gap-3">
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost h-auto py-1.5 px-2.5 sm:px-3 rounded-xl flex items-center gap-2.5 sm:gap-3 hover:bg-base-200"
              aria-label="Menú de usuario"
            >
              <div className="avatar placeholder">
                <div className="bg-primary/10 text-primary rounded-xl w-9 h-9 flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                  {userInitials || <UserIcon className="w-4 h-4" />}
                </div>
              </div>

              <div className="flex flex-col text-right items-end justify-center">
                <span className="font-semibold text-xs sm:text-sm text-base-content leading-tight">
                  {user.name} {user.lastname}
                </span>
                <span className="text-[11px] sm:text-xs text-primary font-medium leading-tight mt-0.5">
                  {user.role?.name ?? user.idRole}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 opacity-50 hidden sm:block" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm bg-base-100 rounded-2xl z-50 w-60 p-2 shadow-2xl border border-base-300 mt-2 gap-1 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <li className="menu-title px-3 py-2 border-b border-base-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-base-content">
                    {user.role?.name ?? "Rol no definido"}
                  </span>
                </div>
                <span className="text-[11px] font-normal text-base-content/60 lowercase">
                  {user.name.toLowerCase()}.{user.lastname.toLowerCase()}@sellervate.internal
                </span>
              </li>

              <li className="mt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-error hover:bg-error/10 hover:text-error rounded-xl font-medium py-2 px-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
