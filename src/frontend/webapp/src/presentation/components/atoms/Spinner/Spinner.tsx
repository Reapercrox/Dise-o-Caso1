import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'Loading…' }) => (
  <div className={styles.wrapper} role="status" aria-label={label}>
    <div className={`${styles.ring} ${styles[size]}`} />
    {label && <span className={styles.label}>{label}</span>}
  </div>
);

export default Spinner;
