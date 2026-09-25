import { RoleCode } from "@/lib/types/role";

export type RoleResolvable = string | { code?: string } | { role?: { code?: string } | null } | null | undefined;

export function extractRoleCode(subject: RoleResolvable): string | null {
  if (!subject) return null;
  if (typeof subject === "string") return subject;
  if ("role" in subject && subject.role && typeof subject.role.code === "string") {
    return subject.role.code;
  }
  if ("code" in subject && typeof subject.code === "string") {
    return subject.code;
  }
  return null;
}

export function hasRole(subject: RoleResolvable, expectedRole: RoleCode): boolean {
  return extractRoleCode(subject) === expectedRole;
}

export function isSpecialist(subject: RoleResolvable): boolean {
  return hasRole(subject, RoleCode.SPECIALIST);
}

export function isTeamLead(subject: RoleResolvable): boolean {
  return hasRole(subject, RoleCode.TEAM_LEAD);
}

export function isAdmin(subject: RoleResolvable): boolean {
  return hasRole(subject, RoleCode.ADMIN);
}

export function hasAnyRole(subject: RoleResolvable, roles: readonly RoleCode[]): boolean {
  const code = extractRoleCode(subject);
  return code !== null && roles.includes(code as RoleCode);
}

