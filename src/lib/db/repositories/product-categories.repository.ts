import { sql } from "@/lib/db";
import { ProductCategorySql } from "@/lib/types/product-category";
import { toProductCategory } from "@/lib/db/mappers";

export async function getAllProductCategories() {
  const rows = await sql<ProductCategorySql[]>`
    SELECT * FROM product_categories WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map((row) => toProductCategory(row));
}
