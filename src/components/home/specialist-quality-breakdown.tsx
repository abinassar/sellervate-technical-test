"use client";

import { QualityLevelMetric } from "@/lib/types/analytics";
import { BarChart2 } from "lucide-react";

interface SpecialistQualityBreakdownProps {
  data: QualityLevelMetric[];
}

const LEVEL_COLORS: Record<number, string> = {
  0: "#EF4444", // Red - Pésimo
  25: "#F59E0B", // Amber - Medianamente Deficiente
  50: "#3B82F6", // Blue - Bueno
  75: "#6366F1", // Indigo - Bastante Bueno
  100: "#10B981", // Emerald - Excelente
};

export function SpecialistQualityBreakdown({ data }: SpecialistQualityBreakdownProps) {
  const totalRated = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-base-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-success/10 text-success rounded-xl">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-base-content leading-tight">
              Tu Distribución de Calidad
            </h3>
            <p className="text-xs opacity-60">Porcentaje de respuestas obtenidas en cada ponderación</p>
          </div>
        </div>

        <span className="badge badge-success font-semibold text-xs py-2.5 px-3">
          {totalRated} respuestas evaluadas
        </span>
      </div>

      {totalRated === 0 ? (
        <div className="text-center p-8 text-xs opacity-60">
          Aún no tienes respuestas evaluadas por tus supervisores.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {data.map((item) => {
            const color = LEVEL_COLORS[item.qualityLevel.level] || "#8B5CF6";
            return (
              <div
                key={item.qualityLevel.id}
                className="p-3.5 rounded-xl border border-base-300/70 bg-base-200/40 hover:bg-base-200/80 transition-all flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono font-bold text-base-content/80">
                    {item.count} resp.
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-base-content leading-tight">
                    {item.qualityLevel.name}
                  </p>
                  <p className="text-[11px] opacity-60 font-mono mt-0.5">
                    {item.qualityLevel.level} pts
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-base-300/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] opacity-60">Porcentaje</span>
                    <span
                      className="font-bold font-mono text-sm"
                      style={{ color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
