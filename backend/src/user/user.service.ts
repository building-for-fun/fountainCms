import { Injectable } from '@nestjs/common';

export interface UserDetails {
  id: string;
  bookmark: unknown;
  user: string;
  role: unknown;
  collection: string;
  search: unknown;
  layout: string;
  layout_query: unknown;
  layout_options: unknown;
  refresh_interval: unknown;
  filter: unknown;
  icon: string;
  color: unknown;
}

@Injectable()
export class UserService {
  private users: UserDetails[] = [
    {
      id: '1',
      bookmark: null,
      user: '79df1726-6c1b-4871-832b-902ff3a9b618',
      role: null,
      collection: 'directus_users',
      search: null,
      layout: 'cards',
      layout_query: {
        cards: {
          sort: ['email'],
          page: 1,
        },
      },
      layout_options: {
        cards: {
          icon: 'account_circle',
          title: '{{ first_name }} {{ last_name }}',
          subtitle: '{{ email }}',
          size: 4,
        },
      },
      refresh_interval: null,
      filter: null,
      icon: 'bookmark',
      color: null,
    },
    {
      id: '2',
      bookmark: null,
      user: 'b2c1d2e3-f4a5-6789-0123-456789abcdef',
      role: 'admin',
      collection: 'directus_users',
      search: null,
      layout: 'cards',
      layout_query: {
        cards: {
          sort: ['name'],
          page: 2,
        },
      },
      layout_options: {
        cards: {
          icon: 'admin_panel_settings',
          title: '{{ first_name }} {{ last_name }}',
          subtitle: '{{ email }}',
          size: 4,
        },
      },
      refresh_interval: null,
      filter: null,
      icon: 'admin',
      color: '#ffcc00',
    },
  ];

  getAll(): UserDetails[] {
    return this.users;
  }

  getById(id: string): UserDetails | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(user: Partial<UserDetails>): UserDetails {
    const newUser: UserDetails = {
      id: user.id || Date.now().toString(),
      bookmark: user.bookmark ?? null,
      user: user.user ?? '',
      role: user.role ?? null,
      collection: user.collection ?? '',
      search: user.search ?? null,
      layout: user.layout ?? '',
      layout_query: user.layout_query ?? {},
      layout_options: user.layout_options ?? {},
      refresh_interval: user.refresh_interval ?? null,
      filter: user.filter ?? null,
      icon: user.icon ?? '',
      color: user.color ?? null,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, update: Partial<UserDetails>): UserDetails | undefined {
    const user = this.getById(id);
    if (!user) return undefined;
    Object.assign(user, update);
    return user;
  }

  delete(id: string): boolean {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }
}
