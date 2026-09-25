import { getAllRoles } from "@/lib/db/repositories/roles.repository";
import { getAllUsers } from "@/lib/db/repositories/users.repository";
import { getAllBrands } from "@/lib/db/repositories/brands.repository";
import { getAllProductCategories } from "@/lib/db/repositories/product-categories.repository";
import { getAllProducts } from "@/lib/db/repositories/products.repository";
import { getAllQualityLevels } from "@/lib/db/repositories/quality-levels.repository";
import { getAllConversations } from "@/lib/db/repositories/conversations.repository";
import { getAllMessages } from "@/lib/db/repositories/messages.repository";

export const dynamic = "force-dynamic";

const ENTITIES = [
  { key: "roles", label: "Roles", fetcher: getAllRoles },
  { key: "users", label: "Users", fetcher: getAllUsers },
  { key: "brands", label: "Brands", fetcher: getAllBrands },
  { key: "product_categories", label: "Product Categories", fetcher: getAllProductCategories },
  { key: "products", label: "Products", fetcher: getAllProducts },
  { key: "quality_levels", label: "Quality Levels", fetcher: getAllQualityLevels },
  { key: "conversations", label: "Conversations", fetcher: getAllConversations },
  { key: "messages", label: "Messages", fetcher: getAllMessages },
] as const;

export default async function DataPage() {
  const results = await Promise.all(
    ENTITIES.map(async ({ key, label, fetcher }) => {
      try {
        const data = await fetcher();
        return { key, label, data, error: null };
      } catch (err) {
        return {
          key,
          label,
          data: null,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    })
  );

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <h1 className="text-2xl font-bold font-mono mb-6">
        /data — Seed Database Inspector
      </h1>

      <div className="space-y-6">
        {results.map(({ key, label, data, error }) => (
          <section key={key}>
            <h2 className="text-sm font-semibold font-mono uppercase tracking-wider mb-2">
              {label}{" "}
              {data && (
                <span className="opacity-50">({data.length} records)</span>
              )}
            </h2>

            {error ? (
              <pre className="bg-error/10 text-error text-xs font-mono p-4 rounded overflow-auto">
                Error: {error}
              </pre>
            ) : (
              <pre className="bg-base-100 border border-base-300 text-xs font-mono p-4 rounded overflow-auto max-h-[400px]">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
