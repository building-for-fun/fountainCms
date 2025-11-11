import { Injectable } from '@nestjs/common';

export interface RoleDetails {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

@Injectable()
export class RolesService {
  private roles: RoleDetails[] = [
    {
      id: 'r1',
      name: 'editor',
      description: 'Can edit content',
      permissions: ['read', 'write'],
    },
    {
      id: 'r2',
      name: 'admin',
      description: 'Full access',
      permissions: ['read', 'write', 'delete', 'admin'],
    },
  ];

  getAll(): RoleDetails[] {
    return this.roles;
  }

  getById(id: string): RoleDetails | undefined {
    return this.roles.find((r) => r.id === id);
  }

  create(role: Partial<RoleDetails>): RoleDetails {
    const newRole: RoleDetails = {
      id: role.id || Date.now().toString(),
      name: role.name ?? '',
      description: role.description ?? '',
      permissions: role.permissions ?? [],
    };
    this.roles.push(newRole);
    return newRole;
  }

  update(id: string, update: Partial<RoleDetails>): RoleDetails | undefined {
    const role = this.getById(id);
    if (!role) return undefined;
    Object.assign(role, update);
    return role;
  }

  delete(id: string): boolean {
    const idx = this.roles.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.roles.splice(idx, 1);
    return true;
  }
}
