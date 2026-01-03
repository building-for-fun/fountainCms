export interface Role {
  name: string;
}

export interface User {
  id: string;
  user: string;
  role?: Role;
  collection: string;
  layout: string;
  icon: string;
  color?: string;
}
