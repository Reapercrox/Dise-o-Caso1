import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/providers/AuthProvider';
import Button from '../../components/atoms/Button/Button';
import Input from '../../components/atoms/Input/Input';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError((err as Error).message ?? t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>⚖️</span>
          <h1 className={styles.title}>DUA Generator</h1>
          <p className={styles.subtitle}>Sign in to continue</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label={t('auth.username')}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className={styles.errorMsg}>{error}</p>}

          <Button type="submit" loading={loading} size="lg">
            {t('auth.login')}
          </Button>
        </form>

        <p className={styles.mfaNote}>
          🔒 Multi-factor authentication via AWS Cognito
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
