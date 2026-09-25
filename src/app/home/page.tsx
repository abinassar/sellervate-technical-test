import { checkDatabaseConnection } from "@/lib/db";
import { Database, CheckCircle2, XCircle, Clock, Server, AlertTriangle, Layers } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Toolbar } from "@/components/layout/toolbar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dbStatus = await checkDatabaseConnection();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
        <Toolbar title="Sellervate" subtitle="Panel de Diagnóstico Base" />

        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-300">
            <div className="card-body gap-6">
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-base-300 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Database className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sellervate Technical Test</h1>
                    <p className="text-sm opacity-70">Panel de Estado y Diagnóstico Base</p>
                  </div>
                </div>

                <div>
                  {dbStatus.isConnected ? (
                    <div className="badge badge-success gap-2 py-3 px-4 font-semibold text-success-content">
                      <CheckCircle2 className="w-4 h-4" />
                      Conectado
                    </div>
                  ) : (
                    <div className="badge badge-error gap-2 py-3 px-4 font-semibold text-error-content">
                      <XCircle className="w-4 h-4" />
                      Desconectado
                    </div>
                  )}
                </div>
              </header>

              <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2">
                  <Server className="w-4 h-4" /> Estado de PostgreSQL
                </h2>

                {dbStatus.isConnected ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-base-200 p-4 rounded-lg flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs opacity-60">Timestamp del Servidor</p>
                        <p className="text-sm font-mono font-medium">{dbStatus.timestamp}</p>
                      </div>
                    </div>

                    <div className="bg-base-200 p-4 rounded-lg flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-xs opacity-60">Latencia de Consulta</p>
                        <p className="text-sm font-mono font-medium">{dbStatus.latencyMs} ms</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-error shadow-sm text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <h3 className="font-bold">Error de Conexión</h3>
                      <p className="font-mono text-xs mt-1">{dbStatus.error}</p>
                      <p className="text-xs opacity-90 mt-2">
                        Asegúrate de haber levantado el contenedor de PostgreSQL ejecutando: <code>docker compose up -d</code>
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-3 pt-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Stack Técnico Integrado
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-neutral">Next.js App Router</span>
                  <span className="badge badge-neutral">TypeScript</span>
                  <span className="badge badge-neutral">Tailwind CSS</span>
                  <span className="badge badge-neutral">daisyUI</span>
                  <span className="badge badge-neutral">PostgreSQL</span>
                  <span className="badge badge-neutral">Supabase JS</span>
                  <span className="badge badge-neutral">Recharts</span>
                  <span className="badge badge-neutral">Lucide Icons</span>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
