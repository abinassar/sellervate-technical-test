"use client";

import { User } from "@/lib/types/user";
import { MessageSquare, HelpCircle } from "lucide-react";

interface CustomerHomeViewProps {
  currentUser: User | null;
}

export function CustomerHomeView({ currentUser }: CustomerHomeViewProps) {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm text-center space-y-4">
        <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl ring-8 ring-primary/5">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content">
            Centro de Ayuda y Soporte
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Bienvenido/a, {currentUser?.name} {currentUser?.lastname}.
          </p>
        </div>
        <div className="alert alert-info max-w-md mx-auto text-xs text-left">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>
            Las herramientas de auditoría y evaluación de calidad están reservadas para usuarios del equipo técnico y de control de calidad.
          </span>
        </div>
      </div>
    </div>
  );
}
