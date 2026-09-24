import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER || "postgres"}:${process.env.POSTGRES_PASSWORD || "postgres"}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT || "5432"}/${process.env.POSTGRES_DB || "sellervate_db"}`;

const globalForDb = globalThis as unknown as {
  sql: postgres.Sql | undefined;
};

export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export interface DbConnectionStatus {
  isConnected: boolean;
  timestamp: string | null;
  latencyMs: number | null;
  error: string | null;
}

export async function checkDatabaseConnection(): Promise<DbConnectionStatus> {
  const startTime = Date.now();
  try {
    const result = await sql<[{ now: Date }]>`SELECT NOW() as now`;
    return {
      isConnected: true,
      timestamp: result[0]?.now ? new Date(result[0].now).toISOString() : new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      error: null,
    };
  } catch (err) {
    return {
      isConnected: false,
      timestamp: null,
      latencyMs: null,
      error: err instanceof Error ? err.message : "Error desconocido al conectar con PostgreSQL",
    };
  }
}

