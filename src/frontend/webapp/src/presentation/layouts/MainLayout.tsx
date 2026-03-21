import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/organisms/Sidebar';
import Spinner from '../components/atoms/Spinner/Spinner';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => (
  <div className={styles.shell}>
    <Sidebar />
    <main className={styles.content}>
      <Suspense
        fallback={
          <div className={styles.loader}>
            <Spinner size="lg" label="Loading page…" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </main>
  </div>
);

export default MainLayout;
