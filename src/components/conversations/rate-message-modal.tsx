"use client";

import { useState, useTransition } from "react";
import { Message } from "@/lib/types/message";
import { QualityLevel } from "@/lib/types/quality-level";
import { User } from "@/lib/types/user";
import { rateMessageAction } from "@/lib/actions/rating.actions";
import { toastService } from "@/lib/toast";
import { MessageSquare, Award, CheckCircle, X, Sparkles, AlertCircle } from "lucide-react";

interface RateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  qualityLevels: QualityLevel[];
  currentUser: User | null;
  onRateSuccess?: (updatedMessageId: string, qualityLevel: QualityLevel) => void;
}

export function RateMessageModal({
  isOpen,
  onClose,
  message,
  qualityLevels,
  currentUser,
  onRateSuccess,
}: RateMessageModalProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    () => message?.idQualityLevel || qualityLevels[2]?.id || qualityLevels[0]?.id || ""
  );
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !message) return null;

  const selectedQuality = qualityLevels.find((q) => q.id === selectedLevelId);

  const getBadgeColorClass = (level: number) => {
    if (level >= 80) return "badge-success text-success-content";
    if (level >= 60) return "badge-primary text-primary-content";
    if (level >= 40) return "badge-info text-info-content";
    if (level >= 20) return "badge-warning text-warning-content";
    return "badge-error text-error-content";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevelId || !currentUser) {
      toastService.error("Debes seleccionar una ponderación válida y tener una sesión activa.");
      return;
    }

    startTransition(async () => {
      const result = await rateMessageAction(message.id, selectedLevelId, currentUser.id);
      if (result.success) {
        toastService.success("¡Ponderación guardada correctamente!");
        if (selectedQuality && onRateSuccess) {
          onRateSuccess(message.id, selectedQuality);
        }
        onClose();
      } else {
        toastService.error(result.error || "Error al registrar la evaluación.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="card w-full max-w-lg bg-base-100 shadow-2xl border border-base-300 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="card-body p-6 gap-5">
          <header className="flex items-center justify-between border-b border-base-300 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 id="modal-title" className="font-bold text-lg leading-tight">
                  Evaluar Calidad de Respuesta
                </h2>
                <p className="text-xs opacity-60">Asignar ponderación y observación al especialista</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="bg-base-200/80 p-3.5 rounded-xl border border-base-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Respuesta del Especialista ({message.userAuthor?.name ?? "Especialista"})
              </span>
              <span className="text-[11px] opacity-60 font-mono">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-xs text-base-content leading-relaxed italic line-clamp-4 bg-base-100 p-2.5 rounded-lg border border-base-300/60">
              &ldquo;{message.message}&rdquo;
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend font-semibold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Ponderación / Nivel de Calidad
              </legend>
              <select
                value={selectedLevelId}
                onChange={(e) => setSelectedLevelId(e.target.value)}
                disabled={isPending || qualityLevels.length === 0}
                className="select select-bordered w-full text-sm font-medium"
                aria-label="Seleccionar nivel de calidad"
                required
              >
                {qualityLevels.map((ql) => (
                  <option key={ql.id} value={ql.id}>
                    {ql.name} ({ql.level} pts)
                  </option>
                ))}
              </select>
            </fieldset>

            {selectedQuality && (
              <div className="p-3.5 rounded-xl border border-base-300 bg-base-200/50 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1.5 opacity-80">
                    <AlertCircle className="w-3.5 h-3.5 text-primary" />
                    Observación Estándar Asociada
                  </span>
                  <span className={`badge badge-sm font-bold ${getBadgeColorClass(selectedQuality.level)}`}>
                    {selectedQuality.name} • {selectedQuality.level}%
                  </span>
                </div>
                <p className="text-xs text-base-content/90 leading-relaxed bg-base-100 p-2.5 rounded-lg border border-base-300/60">
                  {selectedQuality.description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-300">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="btn btn-ghost btn-sm text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !selectedLevelId}
                className="btn btn-primary btn-sm text-xs font-semibold gap-1.5 shadow-md"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Guardar Ponderación</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
