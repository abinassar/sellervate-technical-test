import { sql } from "@/lib/db";
import { ProductSql } from "@/lib/types/product";
import { toProduct } from "@/lib/db/mappers";

export async function getAllProducts() {
  const rows = await sql<ProductSql[]>`
    SELECT * FROM products WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map((row) => toProduct(row));
}
