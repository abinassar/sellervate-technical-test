"use client";

import { useSyncExternalStore } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { QualityLevelMetric } from "@/lib/types/analytics";
import { PieChart as PieChartIcon } from "lucide-react";

interface QualityDonutChartProps {
  data: QualityLevelMetric[];
}

const LEVEL_COLORS: Record<number, string> = {
  0: "#EF4444", // Red - Pésimo
  25: "#F59E0B", // Amber - Medianamente Deficiente
  50: "#3B82F6", // Blue - Bueno
  75: "#6366F1", // Indigo - Bastante Bueno
  100: "#10B981", // Emerald - Excelente
};

const emptySubscribe = () => () => {};

export function QualityDonutChart({ data }: QualityDonutChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const totalResponses = data.reduce((acc, curr) => acc + curr.count, 0);

  const chartData = data.map((item) => ({
    name: item.qualityLevel.name,
    value: item.count,
    level: item.qualityLevel.level,
    percentage: item.percentage,
    color: LEVEL_COLORS[item.qualityLevel.level] || "#8B5CF6",
  }));

  const hasData = totalResponses > 0;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6 rounded-2xl">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-base-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-base-content leading-tight">
              Distribución de Niveles de Calidad
            </h3>
            <p className="text-xs opacity-60">Recuento total de respuestas por ponderación</p>
          </div>
        </div>

        <span className="badge badge-neutral font-semibold text-xs py-2.5 px-3">
          {totalResponses} respuestas evaluadas
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Donut Chart Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[260px]">
          {!isMounted ? (
            <div className="flex items-center justify-center h-48">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : !hasData ? (
            <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
              <PieChartIcon className="w-12 h-12 opacity-20" />
              <p className="text-xs opacity-60">Aún no hay respuestas ponderadas en el sistema.</p>
            </div>
          ) : (
            <div className="w-full h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-base-300/95 backdrop-blur-sm p-2.5 rounded-xl border border-base-content/10 shadow-lg text-xs space-y-1">
                            <p className="font-bold flex items-center gap-1.5" style={{ color: item.color }}>
                              <span>●</span> {item.name}
                            </p>
                            <p className="text-base-content/80 font-medium">
                              {item.value} respuestas ({item.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Total Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                  {totalResponses}
                </span>
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-55">
                  Total
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legend / Metrics List */}
        <div className="lg:col-span-6 flex flex-col gap-2.5">
          {data.map((item) => {
            const color = LEVEL_COLORS[item.qualityLevel.level] || "#8B5CF6";
            return (
              <div
                key={item.qualityLevel.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-base-200/50 hover:bg-base-200 border border-base-300/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-base-content">
                      {item.qualityLevel.name}
                    </span>
                    <span className="text-[10px] opacity-60 ml-1.5 font-mono">
                      ({item.qualityLevel.level} pts)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-base-content font-mono">
                    {item.count}
                  </span>
                  <span
                    className="badge badge-sm font-semibold text-[11px] min-w-[52px] justify-center"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                      borderColor: `${color}40`,
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
