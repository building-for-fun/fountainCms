import { User } from '../types/user';

/**
 * Get the role name from a user object
 */
export const getUserRole = (user: User | null): string => {
  return user?.role?.name || 'user';
};

/**
 * Get permissions based on role name
 * Admin role has all permissions, user role has only read permission
 */
export const getPermissionsFromRole = (roleName: string): string[] => {
  if (roleName === 'admin') {
    return ['read', 'write', 'admin', 'delete'];
  }
  return ['read'];
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (roleName: string, permission: string): boolean => {
  const permissions = getPermissionsFromRole(roleName);
  return permissions.includes(permission);
};
