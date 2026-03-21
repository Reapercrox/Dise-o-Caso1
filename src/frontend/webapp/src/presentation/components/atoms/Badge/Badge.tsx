import React from 'react';
import styles from './Badge.module.css';
import type { ConfidenceLevel } from '../../../../shared/types/common';

interface BadgeProps {
  level: ConfidenceLevel;
  score?: number;
  label?: string;
}

const Badge: React.FC<BadgeProps> = ({ level, score, label }) => {
  const defaultLabels: Record<ConfidenceLevel, string> = {
    green: 'High',
    yellow: 'Medium',
    red: 'Low',
  };
  return (
    <span className={`${styles.badge} ${styles[level]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {label ?? defaultLabels[level]}
      {score !== undefined && (
        <span className={styles.score}>{score}%</span>
      )}
    </span>
  );
};

export default Badge;
