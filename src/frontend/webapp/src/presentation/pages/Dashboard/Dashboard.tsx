import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/providers/AuthProvider';
import styles from './Dashboard.module.css';

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}> = ({ label, value, icon, trend }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statBody}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {trend && <span className={styles.statTrend}>{trend}</span>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Welcome back{user?.username ? `, ${user.username}` : ''}
          </h1>
          <p className={styles.subtitle}>
            Here's an overview of your DUA generation activity.
          </p>
        </div>
        <div className={styles.roleBadge}>{user?.role}</div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="DUAs Generated"   value={42}   icon="📄" trend="↑ 8 this week" />
        <StatCard label="Pending Review"   value={5}    icon="🕐" />
        <StatCard label="High Confidence"  value="78%"  icon="✅" trend="↑ 3% vs last month" />
        <StatCard label="Open Issues"      value={12}   icon="⚠️" />
      </div>

      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>{t('reports.jobHistory')}</h2>
        <div className={styles.jobTable}>
          <div className={styles.tableHeader}>
            <span>Job ID</span>
            <span>Date</span>
            <span>Files</span>
            <span>Status</span>
            <span>Confidence</span>
          </div>
          {[
            { id: 'job-001', date: '2025-07-10', files: 4, status: 'Complete',  conf: 'High' },
            { id: 'job-002', date: '2025-07-09', files: 2, status: 'Complete',  conf: 'Medium' },
            { id: 'job-003', date: '2025-07-08', files: 6, status: 'Failed',    conf: '—' },
            { id: 'job-004', date: '2025-07-07', files: 3, status: 'Complete',  conf: 'High' },
          ].map((job) => (
            <div key={job.id} className={styles.tableRow}>
              <span className={styles.jobId}>{job.id}</span>
              <span>{job.date}</span>
              <span>{job.files} files</span>
              <span
                className={`${styles.jobStatus} ${
                  job.status === 'Complete' ? styles.complete : styles.failed
                }`}
              >
                {job.status}
              </span>
              <span className={styles.confLabel}>{job.conf}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
