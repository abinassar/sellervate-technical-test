import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Toolbar } from "@/components/layout/toolbar";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { getConversationWithDetailsById } from "@/lib/db/repositories/conversations.repository";
import { getAllQualityLevels } from "@/lib/db/repositories/quality-levels.repository";
import { ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = await params;

  const [conversation, qualityLevels] = await Promise.all([
    getConversationWithDetailsById(id),
    getAllQualityLevels(),
  ]);

  if (!conversation) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
          <Toolbar title="Sellervate" subtitle="Conversación no encontrada" />
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="card w-full max-w-md bg-base-100 p-6 border border-base-300 shadow-md text-center space-y-4">
              <div className="p-3 bg-error/10 text-error rounded-2xl w-fit mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-lg">Conversación no encontrada</h2>
              <p className="text-xs opacity-70">
                El identificador de conversación no corresponde a un registro activo.
              </p>
              <Link href="/home" className="btn btn-primary btn-sm gap-2 w-full">
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </Link>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="h-screen bg-base-200 text-base-content flex flex-col overflow-hidden">
        <Toolbar
          title="Sellervate"
          subtitle={`Revisión de Conversación • ${conversation.code}`}
        >
          <Link
            href="/home"
            className="btn btn-ghost btn-sm gap-2 text-xs font-semibold hover:bg-base-200 ml-2"
            aria-label="Volver a la ventana principal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al Inicio</span>
          </Link>
        </Toolbar>

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col max-w-7xl w-full mx-auto">
          {/* Top navigation banner with return button */}
          <div className="flex items-center justify-between gap-4 mb-3 shrink-0">
            <Link
              href="/home"
              className="btn btn-outline btn-sm gap-2 text-xs font-semibold rounded-xl bg-base-100 shadow-xs hover:bg-base-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a las Conversaciones</span>
            </Link>

            <div className="flex items-center gap-2 text-xs opacity-75">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {conversation.messagesCount ?? conversation.messages?.length ?? 0} mensajes en total
              </span>
            </div>
          </div>

          {/* Full conversation card expanding to fill screen height on desktop */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ConversationCard
              conversation={conversation}
              mode="full"
              qualityLevels={qualityLevels}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
