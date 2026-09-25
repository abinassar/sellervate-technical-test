import { AuthGuard } from "@/components/auth/auth-guard";
import { Toolbar } from "@/components/layout/toolbar";
import { RoleHomeDispatcher } from "@/components/home/role-home-dispatcher";
import { getRecentConversationsWithDetails } from "@/lib/db/repositories/conversations.repository";
import { getAllQualityLevels } from "@/lib/db/repositories/quality-levels.repository";
import {
  getGlobalQualityLevelDistribution,
  getSpecialistsPerformanceStats,
  getAllRecentEvaluations,
} from "@/lib/db/repositories/analytics.repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    conversations,
    qualityLevels,
    globalQualityDistribution,
    specialistsStats,
    recentEvaluations,
  ] = await Promise.all([
    getRecentConversationsWithDetails(3),
    getAllQualityLevels(),
    getGlobalQualityLevelDistribution(),
    getSpecialistsPerformanceStats(),
    getAllRecentEvaluations(30),
  ]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
        <Toolbar title="Sellervate" subtitle="Panel de Control Principal" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <RoleHomeDispatcher
            conversations={conversations}
            qualityLevels={qualityLevels}
            globalQualityDistribution={globalQualityDistribution}
            specialistsStats={specialistsStats}
            recentEvaluations={recentEvaluations}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
