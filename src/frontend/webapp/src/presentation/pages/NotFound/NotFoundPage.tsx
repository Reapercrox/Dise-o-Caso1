import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/atoms/Button/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.sub}>
        The page you're looking for doesn't exist or you don't have permission to access it.
      </p>
      <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
    </div>
  );
};

export default NotFoundPage;
