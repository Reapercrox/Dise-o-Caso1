import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { markIssueReviewed, ignoreIssue } from '../../../../domain/dua/duaSlice';
import type { ValidationIssue } from '../../../../domain/dua/duaSlice';
import Button from '../atoms/Button/Button';
import styles from './IssueCard.module.css';

interface IssueCardProps {
  issue: ValidationIssue;
}

const severityIcon: Record<ValidationIssue['severity'], string> = {
  error:   '⛔',
  warning: '⚠️',
  info:    'ℹ️',
};

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [ignoringReason, setIgnoringReason] = useState('');
  const [showIgnoreInput, setShowIgnoreInput] = useState(false);

  const handleMarkReviewed = () => dispatch(markIssueReviewed(issue.id));

  const handleIgnore = () => {
    if (!ignoringReason.trim()) return;
    dispatch(ignoreIssue({ id: issue.id, reason: ignoringReason }));
    setShowIgnoreInput(false);
  };

  if (issue.status !== 'open') {
    return (
      <div className={`${styles.card} ${styles.resolved}`}>
        <span className={styles.resolvedLabel}>
          {issue.status === 'reviewed' ? '✓ Reviewed' : `Ignored: ${issue.ignoreReason}`}
        </span>
        <span className={styles.message}>{issue.message}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles[issue.severity]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{severityIcon[issue.severity]}</span>
        <p className={styles.message}>{issue.message}</p>
      </div>

      <div className={styles.actions}>
        <Button size="sm" variant="secondary" onClick={handleMarkReviewed}>
          {t('issues.markReviewed')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowIgnoreInput((v) => !v)}
        >
          {t('issues.ignoreWithReason')}
        </Button>
      </div>

      {showIgnoreInput && (
        <div className={styles.ignoreRow}>
          <input
            className={styles.ignoreInput}
            placeholder="Reason for ignoring…"
            value={ignoringReason}
            onChange={(e) => setIgnoringReason(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIgnore()}
          />
          <Button size="sm" onClick={handleIgnore} disabled={!ignoringReason.trim()}>
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
