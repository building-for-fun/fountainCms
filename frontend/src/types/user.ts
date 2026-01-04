export interface Role {
  name: string | null;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  role?: Role;
  permissions: string[];
}
