"use client";

import { Conversation } from "@/lib/types/conversation";
import { QualityLevel } from "@/lib/types/quality-level";
import { User } from "@/lib/types/user";
import { QualityLevelMetric, SpecialistStats } from "@/lib/types/analytics";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { QualityDonutChart } from "@/components/home/quality-donut-chart";
import { SpecialistsStatsTable } from "@/components/home/specialists-stats-table";
import {
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Layers,
  BarChart3,
} from "lucide-react";

interface AdminTeamLeadHomeViewProps {
  conversations: Conversation[];
  qualityLevels: QualityLevel[];
  currentUser: User | null;
  globalQualityDistribution: QualityLevelMetric[];
  specialistsStats: SpecialistStats[];
}

export function AdminTeamLeadHomeView({
  conversations,
  qualityLevels,
  currentUser,
  globalQualityDistribution,
  specialistsStats,
}: AdminTeamLeadHomeViewProps) {
  const totalMessagesCount = conversations.reduce(
    (acc, curr) => acc + (curr.messagesCount ?? curr.messages?.length ?? 0),
    0
  );

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Header & Metrics Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl ring-4 ring-primary/5">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
              Panel de Evaluación de Calidad
            </h1>
            <p className="text-xs sm:text-sm opacity-70 mt-0.5">
              Supervisión de interacciones y ponderación de respuestas de especialistas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-primary badge-lg py-3 px-4 gap-2 font-semibold">
            <Sparkles className="w-4 h-4" />
            {currentUser?.role?.name ?? "Evaluador"}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs opacity-60">Conversaciones Recientes</p>
            <p className="text-lg font-bold">{conversations.length}</p>
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-secondary/10 text-secondary rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs opacity-60">Mensajes Auditables (Vista previa)</p>
            <p className="text-lg font-bold">{totalMessagesCount}</p>
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 text-accent rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs opacity-60">Niveles de Calidad</p>
            <p className="text-lg font-bold">{qualityLevels.length} niveles activos</p>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-70 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Últimas 3 Conversaciones
          </h2>
          <span className="text-xs opacity-60">Ordenadas cronológicamente</span>
        </div>

        {conversations.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 p-8 text-center">
            <p className="text-sm opacity-60">No hay conversaciones registradas en este momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                mode="preview"
                qualityLevels={qualityLevels}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </section>

      {/* Analytics & Performance Section (Below Conversations) */}
      <section className="space-y-6 pt-4 border-t border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-base-content">
              Estadísticas Globales y Métricas de Especialistas
            </h2>
          </div>
          <span className="text-xs opacity-60">Métricas acumuladas del sistema</span>
        </div>

        {/* Donut Chart: Global Quality Level Breakdown */}
        <QualityDonutChart data={globalQualityDistribution} />

        {/* Specialists Performance Table */}
        <SpecialistsStatsTable specialists={specialistsStats} />
      </section>
    </div>
  );
}
