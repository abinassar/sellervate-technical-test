import { sql } from "@/lib/db";
import { BrandSql } from "@/lib/types/brand";
import { toBrand } from "@/lib/db/mappers";

export async function getAllBrands() {
  const rows = await sql<BrandSql[]>`
    SELECT * FROM brands WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map(toBrand);
}
