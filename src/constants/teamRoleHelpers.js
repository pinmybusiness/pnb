// All user roles in one place
export const ROLES = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  ADMIN_TEAM: 2,
  ORGANIZATION_ADMIN: 3,
  ORGANIZATION_MANAGER: 4,
  ORGANIZATION_TEAM: 5,

  BRANCH_ADMIN: 6,
  BRANCH_MANAGER: 7,
  BRANCH_TEAM: 8,
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',

  [ROLES.ADMIN]: 'Company CRM Admin',
  [ROLES.ADMIN_TEAM]: 'Company Team',

  [ROLES.ORGANIZATION_ADMIN]: 'Organization Admin',
  [ROLES.ORGANIZATION_MANAGER]: 'Organization Manager',
  [ROLES.ORGANIZATION_TEAM]: 'Organization Team',

  [ROLES.BRANCH_ADMIN]: 'Admin',
  [ROLES.BRANCH_MANAGER]: 'Team Manager',
  [ROLES.BRANCH_TEAM]: 'Team Member',
};

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
