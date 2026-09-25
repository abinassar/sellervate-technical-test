"use client";

import { Conversation } from "@/lib/types/conversation";
import { QualityLevel } from "@/lib/types/quality-level";
import { User } from "@/lib/types/user";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { MessageSquare, Sparkles, Award, UserCheck } from "lucide-react";

interface SpecialistHomeViewProps {
  conversations: Conversation[];
  qualityLevels: QualityLevel[];
  currentUser: User | null;
}

export function SpecialistHomeView({
  conversations,
  qualityLevels,
  currentUser,
}: SpecialistHomeViewProps) {
  // Filter conversations where this specialist was assigned or wrote messages
  const specialistConversations = conversations.filter(
    (c) =>
      c.idUser === currentUser?.id ||
      c.messages?.some((m) => m.idUserAuthor === currentUser?.id)
  );

  const activeConversations =
    specialistConversations.length > 0 ? specialistConversations : conversations;

  const ratedMessagesCount = activeConversations.reduce(
    (acc, c) =>
      acc +
      (c.messages?.filter(
        (m) => m.idUserAuthor === currentUser?.id && Boolean(m.idQualityLevel)
      ).length ?? 0),
    0
  );

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-secondary/10 text-secondary rounded-2xl ring-4 ring-secondary/5">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
              Panel del Especialista
            </h1>
            <p className="text-xs sm:text-sm opacity-70 mt-0.5">
              Revisa tus interacciones con clientes y las evaluaciones asignadas por tus supervisores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-secondary badge-lg py-3 px-4 gap-2 font-semibold">
            <Sparkles className="w-4 h-4" />
            {currentUser?.name} {currentUser?.lastname}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs opacity-60">Conversaciones Asignadas</p>
            <p className="text-lg font-bold">{activeConversations.length}</p>
          </div>
        </div>

        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-success/10 text-success rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs opacity-60">Respuestas Ponderadas</p>
            <p className="text-lg font-bold">{ratedMessagesCount}</p>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-70 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Mis Conversaciones Recientes
          </h2>
          <span className="text-xs opacity-60">Vista de solo lectura</span>
        </div>

        {activeConversations.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 p-8 text-center">
            <p className="text-sm opacity-60">
              No tienes conversaciones asignadas actualmente.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeConversations.slice(0, 3).map((conversation) => (
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
    </div>
  );
}
