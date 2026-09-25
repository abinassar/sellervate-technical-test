"use client";

import { useState } from "react";
import Link from "next/link";
import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { QualityLevel } from "@/lib/types/quality-level";
import { User } from "@/lib/types/user";
import { useSession } from "@/lib/auth/use-session";
import { RateMessageModal } from "./rate-message-modal";
import {
  MessageSquare,
  ArrowRight,
  User as UserIcon,
  Package,
  Clock,
  Shield,
  Award,
} from "lucide-react";

interface ConversationCardProps {
  conversation: Conversation;
  mode?: "preview" | "full";
  qualityLevels?: QualityLevel[];
  currentUser?: User | null;
}

export function ConversationCard({
  conversation,
  mode = "preview",
  qualityLevels = [],
  currentUser = null,
}: ConversationCardProps) {
  const { user: sessionUser } = useSession();
  const effectiveUser = currentUser ?? sessionUser;
  const [messages, setMessages] = useState<Message[]>(conversation.messages ?? []);
  const [activeRatingMessage, setActiveRatingMessage] = useState<Message | null>(null);

  const isFullMode = mode === "full";
  const displayedMessages = isFullMode ? messages : messages.slice(0, 10);
  const hasMoreThanTenMessages = (conversation.messagesCount ?? messages.length) > 10;

  const isSpecialistAuthor = (message: Message) => {
    return (
      message.userAuthor?.role?.code === "SPECIALIST" ||
      message.idUserAuthor === conversation.idUser
    );
  };

  const getQualityBadgeColor = (level: number) => {
    if (level >= 80) return "badge-success text-success-content";
    if (level >= 60) return "badge-primary text-primary-content";
    if (level >= 40) return "badge-info text-info-content";
    if (level >= 20) return "badge-warning text-warning-content";
    return "badge-error text-error-content";
  };

  const handleRateSuccess = (messageId: string, ratedQuality: QualityLevel) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              idQualityLevel: ratedQuality.id,
              qualityLevel: ratedQuality,
              idRatingUser: currentUser?.id,
              ratingUser: currentUser ?? undefined,
            }
          : msg
      )
    );
  };

  return (
    <>
      <div
        className={`card bg-base-100 shadow-md border border-base-300 transition-all ${
          isFullMode
            ? "w-full h-full flex flex-col md:flex-row overflow-hidden shadow-xl"
            : "w-full flex flex-col md:flex-row hover:shadow-lg"
        }`}
      >
        {/* Left Side: Conversation Title, Description, and Metadata */}
        <aside
          className={`${
            isFullMode
              ? "w-full md:w-80 lg:w-96 p-5 sm:p-6 bg-base-200/60 border-b md:border-b-0 md:border-r border-base-300 flex flex-col justify-between shrink-0 sticky top-16 md:static z-10 backdrop-blur-md md:backdrop-blur-none"
              : "w-full md:w-80 lg:w-96 p-5 sm:p-6 bg-base-200/50 border-b md:border-b-0 md:border-r border-base-300 flex flex-col justify-between shrink-0"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="badge badge-neutral badge-sm font-mono uppercase tracking-wider">
                {conversation.code}
              </span>
              {conversation.product?.category?.brand && (
                <span className="badge badge-outline badge-sm font-medium">
                  {conversation.product.category.brand.name}
                </span>
              )}
            </div>

            <div>
              <h2 className="font-bold text-base sm:text-lg text-base-content leading-snug">
                {conversation.title}
              </h2>
              <p className="text-xs text-base-content/70 mt-2 leading-relaxed">
                {conversation.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-base-300/80 text-xs">
              {conversation.product && (
                <div className="flex items-center gap-2 text-base-content/80">
                  <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate font-medium">{conversation.product.name}</span>
                </div>
              )}

              {conversation.user && (
                <div className="flex items-center gap-2 text-base-content/80">
                  <Shield className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">
                    Especialista:{" "}
                    <strong className="font-semibold text-base-content">
                      {conversation.user.name} {conversation.user.lastname}
                    </strong>
                  </span>
                </div>
              )}

              {conversation.customer && (
                <div className="flex items-center gap-2 text-base-content/80">
                  <UserIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">
                    Cliente:{" "}
                    <span className="font-medium text-base-content/90">
                      {conversation.customer.name} {conversation.customer.lastname}
                    </span>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-base-content/60 text-[11px] pt-1">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {new Date(conversation.createdAt).toLocaleDateString([], {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{conversation.messagesCount ?? messages.length} mensajes</span>
              </div>
            </div>
          </div>

          {!isFullMode && hasMoreThanTenMessages && (
            <div className="pt-4 mt-4 border-t border-base-300 hidden md:block">
              <Link
                href={`/conversation/${conversation.id}`}
                className="btn btn-primary btn-sm w-full gap-2 text-xs font-semibold shadow-sm"
              >
                <span>Ver Conversación Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </aside>

        {/* Right Side: Messages Stream */}
        <main
          className={`flex-1 flex flex-col ${
            isFullMode ? "h-full overflow-hidden bg-base-100" : "p-4 sm:p-6 bg-base-100/50"
          }`}
        >
          <div
            className={`flex-1 flex flex-col gap-4 overflow-y-auto ${
              isFullMode ? "p-4 sm:p-6" : "max-h-[480px] p-2"
            }`}
          >
            {displayedMessages.map((msg) => {
              const isSpecialist = isSpecialistAuthor(msg);
              const authorName = msg.userAuthor
                ? `${msg.userAuthor.name} ${msg.userAuthor.lastname}`
                : isSpecialist
                ? "Especialista"
                : "Cliente";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 ${
                    isSpecialist ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 px-1 text-[11px] opacity-70">
                    <span className="font-medium">{authorName}</span>
                    {isSpecialist && (
                      <span className="badge badge-primary badge-xs py-1 px-1.5 text-[10px] font-semibold">
                        Especialista
                      </span>
                    )}
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 max-w-full sm:max-w-[85%]">
                    {/* Customer Side */}
                    {!isSpecialist && (
                      <div className="p-3.5 rounded-2xl bg-base-200 border border-base-300 text-xs text-base-content leading-relaxed shadow-xs">
                        {msg.message}
                      </div>
                    )}

                    {/* Specialist Side */}
                    {isSpecialist && (
                      <div className="flex items-start gap-2">
                        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-base-content leading-relaxed shadow-xs">
                          {msg.message}

                          {/* Quality Rating Badge (if already rated) */}
                          {msg.qualityLevel && (
                            <div className="mt-2.5 pt-2 border-t border-primary/20 flex flex-wrap items-center gap-2">
                              <span
                                className={`badge badge-sm font-semibold gap-1 ${getQualityBadgeColor(
                                  msg.qualityLevel.level
                                )}`}
                              >
                                <Award className="w-3 h-3" />
                                {msg.qualityLevel.name} ({msg.qualityLevel.level} pts)
                              </span>
                              <span className="text-[11px] opacity-75 line-clamp-1 italic">
                                {msg.qualityLevel.description}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Rating / Comment Button */}
                        {isFullMode && (
                          <button
                            type="button"
                            onClick={() => setActiveRatingMessage(msg)}
                            className="btn btn-circle btn-sm btn-ghost hover:bg-primary/20 text-primary shrink-0 transition-transform active:scale-95"
                            title={
                              msg.qualityLevel
                                ? `Calificado: ${msg.qualityLevel.name}. Clic para editar.`
                                : "Ponderar respuesta del especialista"
                            }
                            aria-label="Ponderar respuesta"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action for Preview Mode */}
          {!isFullMode && hasMoreThanTenMessages && (
            <div className="pt-3 px-2 border-t border-base-300 flex justify-end md:hidden">
              <Link
                href={`/conversation/${conversation.id}`}
                className="btn btn-primary btn-sm w-full gap-2 text-xs font-semibold shadow-sm"
              >
                <span>Ver Conversación Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Modal for rating specialist message */}
      {activeRatingMessage && (
        <RateMessageModal
          key={activeRatingMessage.id}
          isOpen={Boolean(activeRatingMessage)}
          onClose={() => setActiveRatingMessage(null)}
          message={activeRatingMessage}
          qualityLevels={qualityLevels}
          currentUser={effectiveUser}
          onRateSuccess={handleRateSuccess}
        />
      )}
    </>
  );
}
