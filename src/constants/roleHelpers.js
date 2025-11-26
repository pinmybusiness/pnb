import { ROLES } from "./roles";

export const isBranchUser = (role) =>
  [ROLES.BRANCH_ADMIN, ROLES.BRANCH_MANAGER, ROLES.BRANCH_TEAM].includes(role);

export const isOrganizationUser = (role) =>
  [
    ROLES.ORGANIZATION_ADMIN,
    ROLES.ORGANIZATION_MANAGER,
    ROLES.ORGANIZATION_TEAM,
  ].includes(role);

export const isSuperAdmin = (role) =>
  [ROLES.SUPER_ADMIN].includes(role);

export const isRootAdmin = (role) =>
  [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ADMIN_TEAM].includes(role);

export const hasRole = (role, allowed = []) => allowed.includes(role);
