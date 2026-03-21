import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/providers/AuthProvider';
import { accessGuard } from '../../../security/rbac/accessGuard';
import { PERMISSIONS } from '../../../security/rbac/permissions';
import { useTheme } from '../../../app/providers/ThemeProvider';
import Button from '../atoms/Button/Button';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    permission: PERMISSIONS.VIEW_REPORTS,
  },
  {
    to: '/generate-dua',
    label: 'Generate DUA',
    icon: '📄',
    permission: PERMISSIONS.GENERATE_DUA,
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: '📋',
    permission: PERMISSIONS.VIEW_REPORTS,
  },
];

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>⚖️</span>
        <span className={styles.brandName}>DUA Generator</span>
      </div>

      <ul className={styles.nav}>
        {NAV_ITEMS.filter((item) => accessGuard.can(item.permission)).map(
          (item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>

      <div className={styles.footer}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.username}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          {t('common.logout')}
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
