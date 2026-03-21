import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { accessGuard } from '../security/rbac/accessGuard';
import { PERMISSIONS } from '../security/rbac/permissions';
import MainLayout from '../presentation/layouts/MainLayout';
import Dashboard from '../presentation/pages/Dashboard/Dashboard';
import GenerateDUA from '../presentation/pages/GenerateDUA/GenerateDUA';
import Reports from '../presentation/pages/Reports/Reports';
import LoginPage from '../presentation/pages/Login/LoginPage';
import NotFoundPage from '../presentation/pages/NotFound/NotFoundPage';

/** Wraps a route element with a permission check. */
function Protected({
  permission,
  element,
}: {
  permission: string;
  element: React.ReactElement;
}): React.ReactElement {
  if (!accessGuard.can(permission)) {
    return <Navigate to="/login" replace />;
  }
  return element;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Protected
            permission={PERMISSIONS.VIEW_REPORTS}
            element={<Dashboard />}
          />
        ),
      },
      {
        path: 'generate-dua',
        element: (
          <Protected
            permission={PERMISSIONS.GENERATE_DUA}
            element={<GenerateDUA />}
          />
        ),
      },
      {
        path: 'reports',
        element: (
          <Protected
            permission={PERMISSIONS.VIEW_REPORTS}
            element={<Reports />}
          />
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
