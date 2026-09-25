"use client";

import { useSession } from "@/lib/auth/use-session";
import { extractRoleCode } from "@/lib/auth/role-guards";
import { RoleCode } from "@/lib/types/role";
import { Conversation } from "@/lib/types/conversation";
import { QualityLevel } from "@/lib/types/quality-level";
import { AdminTeamLeadHomeView } from "./admin-team-lead-home-view";
import { SpecialistHomeView } from "./specialist-home-view";
import { CustomerHomeView } from "./customer-home-view";

interface RoleHomeDispatcherProps {
  conversations: Conversation[];
  qualityLevels: QualityLevel[];
}

export function RoleHomeDispatcher({
  conversations,
  qualityLevels,
}: RoleHomeDispatcherProps) {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <span className="loading loading-spinner loading-md text-primary" />
        <span className="text-xs opacity-60">Cargando panel...</span>
      </div>
    );
  }

  const roleCode = extractRoleCode(user);

  switch (roleCode) {
    case RoleCode.ADMIN:
    case RoleCode.TEAM_LEAD:
      return (
        <AdminTeamLeadHomeView
          conversations={conversations}
          qualityLevels={qualityLevels}
          currentUser={user}
        />
      );

    case RoleCode.SPECIALIST:
      return (
        <SpecialistHomeView
          conversations={conversations}
          qualityLevels={qualityLevels}
          currentUser={user}
        />
      );

    case RoleCode.CUSTOMER:
    default:
      return <CustomerHomeView currentUser={user} />;
  }
}

