"use client";

import { SpecialistStats } from "@/lib/types/analytics";
import { Users, MessageSquare, TrendingUp } from "lucide-react";

interface SpecialistsStatsTableProps {
  specialists: SpecialistStats[];
}

const LEVEL_COLORS: Record<number, string> = {
  0: "#EF4444", // Red - Pésimo
  25: "#F59E0B", // Amber - Medianamente Deficiente
  50: "#3B82F6", // Blue - Bueno
  75: "#6366F1", // Indigo - Bastante Bueno
  100: "#10B981", // Emerald - Excelente
};

export function SpecialistsStatsTable({ specialists }: SpecialistsStatsTableProps) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-base-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-base-content leading-tight">
              Rendimiento por Especialista
            </h3>
            <p className="text-xs opacity-60">
              Conversaciones asignadas, promedio de mensajes y desglose de calidad
            </p>
          </div>
        </div>

        <span className="badge badge-secondary badge-outline font-semibold text-xs py-2.5 px-3">
          {specialists.length} especialistas registrados
        </span>
      </div>

      {specialists.length === 0 ? (
        <div className="text-center p-8 text-xs opacity-60">
          No hay especialistas registrados en el sistema.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-xs">
            <thead>
              <tr className="border-b border-base-300 text-base-content/70">
                <th className="font-semibold uppercase tracking-wider py-3">Especialista</th>
                <th className="font-semibold uppercase tracking-wider py-3 text-center">
                  Conversaciones
                </th>
                <th className="font-semibold uppercase tracking-wider py-3 text-center">
                  Prom. Msgs / Conv
                </th>
                <th className="font-semibold uppercase tracking-wider py-3 text-center">
                  Total Respuestas
                </th>
                <th className="font-semibold uppercase tracking-wider py-3">
                  Distribución de Calidad (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((stat) => (
                <tr
                  key={stat.specialist.id}
                  className="hover:bg-base-200/50 border-b border-base-300/60 transition-colors"
                >
                  {/* Specialist Name & Avatar */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-base-content">
                          {stat.specialist.name} {stat.specialist.lastname}
                        </p>
                        <p className="text-[11px] opacity-60 font-mono">
                          {stat.specialist.role?.name ?? "Especialista"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Assigned Conversations */}
                  <td className="text-center py-3.5">
                    <span className="badge badge-neutral font-bold text-xs px-2.5 py-2">
                      {stat.assignedConversationsCount}
                    </span>
                  </td>

                  {/* Average Messages / Conv */}
                  <td className="text-center py-3.5">
                    <div className="inline-flex items-center gap-1 font-mono font-semibold text-xs bg-base-200 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>{stat.averageMessagesPerConversation}</span>
                    </div>
                  </td>

                  {/* Total Specialist Messages */}
                  <td className="text-center py-3.5">
                    <div className="inline-flex items-center gap-1 font-mono text-xs opacity-80">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{stat.totalSpecialistMessages}</span>
                      <span className="opacity-60 text-[10px]">
                        ({stat.totalRatedMessages} eval.)
                      </span>
                    </div>
                  </td>

                  {/* Quality Breakdown */}
                  <td className="py-3.5">
                    {stat.totalRatedMessages === 0 ? (
                      <span className="text-[11px] opacity-50 italic">Sin respuestas evaluadas</span>
                    ) : (
                      <div className="flex flex-col gap-1.5 min-w-[280px]">
                        {/* Mini segmented progress bar */}
                        <div className="w-full h-2 rounded-full overflow-hidden bg-base-300 flex">
                          {stat.qualityBreakdown.map((qb) => {
                            if (qb.percentage === 0) return null;
                            const color = LEVEL_COLORS[qb.qualityLevel.level] || "#8B5CF6";
                            return (
                              <div
                                key={qb.qualityLevel.id}
                                style={{
                                  width: `${qb.percentage}%`,
                                  backgroundColor: color,
                                }}
                                title={`${qb.qualityLevel.name}: ${qb.count} (${qb.percentage}%)`}
                              />
                            );
                          })}
                        </div>

                        {/* Pills list */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {stat.qualityBreakdown.map((qb) => {
                            const color = LEVEL_COLORS[qb.qualityLevel.level] || "#8B5CF6";
                            return (
                              <span
                                key={qb.qualityLevel.id}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                                style={{
                                  backgroundColor: `${color}15`,
                                  color: color,
                                  border: `1px solid ${color}30`,
                                }}
                              >
                                <span>{qb.qualityLevel.name}:</span>
                                <strong>{qb.percentage}%</strong>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
