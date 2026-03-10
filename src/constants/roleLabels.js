import { ROLES } from './roles';

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