import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';

import LandingPage from '../pages/LandingPage';
import Documentation from '../pages/Documenation';
import AdminPage from '../pages/AdminPage';
import AdminUserListPage from '../pages/AdminUserListPage';
import AdminUserDetailPage from '../pages/AdminUserDetailPage';
import LoginPage from '../pages/LoginPage';
import AdminContentTypesPage from '../pages/AdminContentTypesPage';
import AdminEntriesPage from '../pages/AdminEntriesPage';
import AdminMediaPage from '../pages/AdminMediaPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import AdminRolesPage from '../pages/AdminRolesPage';
import AdminLogsPage from '../pages/AdminLogsPage';
import AdminProfilePage from '../pages/AdminProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import InternalServerErrorPage from '../pages/InternalServerErrorPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

import { FountainThemeProvider } from '../theme/ThemeProvider';

const RootRoute = createRootRoute({
  component: () => (
    <FountainThemeProvider>
      <Outlet />
    </FountainThemeProvider>
  ),
});

const LoginRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/login',
  component: LoginPage,
});

const AdminLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/admin',
  component: () => <Outlet />,
});

const AdminIndexRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: '/',
  component: AdminPage,
});

const AdminUsersRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'users',
  component: AdminUserListPage,
});

const AdminUserDetailRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'users/$id',
  component: AdminUserDetailPage,
});

const AdminContentTypesRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'content-types',
  component: AdminContentTypesPage,
});

const AdminEntriesRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'entries',
  component: AdminEntriesPage,
});

const AdminMediaRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'media',
  component: AdminMediaPage,
});

const AdminSettingsRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'settings',
  component: AdminSettingsPage,
});

const AdminRolesRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'roles',
  component: AdminRolesPage,
});

const AdminLogsRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'logs',
  component: AdminLogsPage,
});

const AdminProfileRoute = createRoute({
  getParentRoute: () => AdminLayoutRoute,
  path: 'profile',
  component: AdminProfilePage,
});

/** ------------------------------------------------------------------
 * PUBLIC ROUTES
 * -----------------------------------------------------------------*/
const LandingRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: LandingPage,
});

const DocsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/docs',
  component: Documentation,
});

/** ------------------------------------------------------------------
 * ERROR ROUTES
 * -----------------------------------------------------------------*/
const UnauthorizedRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/401',
  component: UnauthorizedPage,
});

const InternalServerErrorRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/500',
  component: InternalServerErrorPage,
});

const NotFoundRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '*',
  component: NotFoundPage,
});

/** ------------------------------------------------------------------
 * Build router tree
 * -----------------------------------------------------------------*/

const routeTree = RootRoute.addChildren([
  LoginRoute,
  LandingRoute,
  DocsRoute,
  UnauthorizedRoute,
  InternalServerErrorRoute,
  NotFoundRoute,

  // Admin
  AdminLayoutRoute.addChildren([
    AdminIndexRoute,
    AdminUsersRoute,
    AdminUserDetailRoute,
    AdminContentTypesRoute,
    AdminEntriesRoute,
    AdminMediaRoute,
    AdminSettingsRoute,
    AdminRolesRoute,
    AdminLogsRoute,
    AdminProfileRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
