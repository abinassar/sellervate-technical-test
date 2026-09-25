import { sql } from "@/lib/db";
import { QualityLevelSql } from "@/lib/types/quality-level";
import { toQualityLevel } from "@/lib/db/mappers";

export async function getAllQualityLevels() {
  const rows = await sql<QualityLevelSql[]>`
    SELECT * FROM quality_levels WHERE deleted_at IS NULL ORDER BY level ASC
  `;
  return rows.map(toQualityLevel);
}
