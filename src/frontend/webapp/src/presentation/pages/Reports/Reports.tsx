import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Reports.module.css';

const Reports: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('reports.title')}</h1>
      <p className={styles.subtitle}>
        View DUA generation history, export summaries, and audit logs.
      </p>

      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon}>📋</span>
        <p>Reports module — connect to your analytics endpoint.</p>
      </div>
    </div>
  );
};

export default Reports;
