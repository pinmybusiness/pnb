import { ROLE_LABELS } from "./roleLabels";
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

export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || 'Unknown';
};

export const canEditTeamMember = (loggedInUser) => {
  if (!loggedInUser) return false;

  // Root admin can edit anyone
  if (loggedInUser.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Branch admin can edit only same branch users
  if (
    loggedInUser.role === ROLES.BRANCH_ADMIN &&
    loggedInUser.branch 
  ) {
    return true;
  }

  return false;
};
