"use client";

import Link from "next/link";
import { Message } from "@/lib/types/message";
import { EvaluatedMessageFeedItem } from "@/lib/types/analytics";
import { Award, ArrowRight, Clock, UserCheck, MessageSquare, AlertCircle } from "lucide-react";

interface MessageDetailProps {
  item?: EvaluatedMessageFeedItem;
  message?: Message;
  conversationId?: string;
  conversationTitle?: string;
  conversationCode?: string;
}

export function MessageDetail({
  item,
  message,
  conversationId,
  conversationTitle,
  conversationCode,
}: MessageDetailProps) {
  const finalId = item?.id ?? message?.id ?? "";
  const finalMessage = item?.message ?? message?.message ?? "";
  const finalDate = item?.createdAt ?? message?.createdAt ?? new Date();
  const finalConversationId = item?.conversationId ?? conversationId ?? message?.idConversation ?? "";
  const finalConversationTitle =
    item?.conversationTitle ?? conversationTitle ?? message?.conversation?.title ?? "Conversación";
  const finalConversationCode =
    item?.conversationCode ?? conversationCode ?? message?.conversation?.code ?? "";
  const qualityLevel = item?.qualityLevel ?? message?.qualityLevel;
  const ratingUser = item?.ratingUser ?? message?.ratingUser;

  const getQualityBadgeColor = (level: number) => {
    if (level >= 80) return "badge-success text-success-content";
    if (level >= 60) return "badge-primary text-primary-content";
    if (level >= 40) return "badge-info text-info-content";
    if (level >= 20) return "badge-warning text-warning-content";
    return "badge-error text-error-content";
  };

  const getQualityBorderColor = (level: number) => {
    if (level >= 80) return "border-l-success";
    if (level >= 60) return "border-l-primary";
    if (level >= 40) return "border-l-info";
    if (level >= 20) return "border-l-warning";
    return "border-l-error";
  };

  return (
    <div
      key={finalId}
      className={`card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden border-l-4 ${
        qualityLevel ? getQualityBorderColor(qualityLevel.level) : "border-l-primary"
      }`}
    >
      <div className="card-body p-4 sm:p-5 gap-3.5">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {finalConversationCode && (
              <span className="badge badge-neutral badge-xs font-mono uppercase tracking-wider">
                {finalConversationCode}
              </span>
            )}
            <span className="text-xs font-bold text-base-content line-clamp-1">
              {finalConversationTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] opacity-60">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {new Date(finalDate).toLocaleDateString([], {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              {new Date(finalDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Message Content Bubble */}
        <div className="bg-base-200/70 p-3 rounded-xl border border-base-300/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tu respuesta enviada:</span>
          </div>
          <p className="text-xs text-base-content leading-relaxed italic">
            &ldquo;{finalMessage}&rdquo;
          </p>
        </div>

        {/* Evaluation & Observation Section */}
        {qualityLevel && (
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`badge badge-sm font-bold gap-1 ${getQualityBadgeColor(
                  qualityLevel.level
                )}`}
              >
                <Award className="w-3 h-3" />
                {qualityLevel.name} ({qualityLevel.level} pts)
              </span>

              {ratingUser && (
                <div className="flex items-center gap-1.5 text-[11px] text-base-content/70">
                  <UserCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>
                    Evaluado por:{" "}
                    <strong className="font-semibold text-base-content">
                      {ratingUser.name} {ratingUser.lastname}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-xs text-base-content/85 pt-1">
              <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[11px] uppercase tracking-wider block opacity-70">
                  Observación de Calidad:
                </span>
                <p className="mt-0.5 leading-relaxed text-xs">
                  {qualityLevel.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {finalConversationId && (
          <div className="flex justify-end pt-1">
            <Link
              href={`/conversation/${finalConversationId}`}
              className="btn btn-sm btn-ghost hover:btn-primary text-xs font-semibold gap-1.5 transition-colors"
            >
              <span>Ver en conversación</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
