import React from 'react';
import { WORKFLOW_STAGE_LABELS } from '../../../shared/constants';
import type { WorkflowStage } from '../../../application/workflow/workflowSlice';
import styles from './StageProgressBar.module.css';

const ORDERED_STAGES: WorkflowStage[] = [
  'ingestion',
  'ocr',
  'extraction',
  'mapping',
  'validation',
  'word',
  'complete',
];

interface StageProgressBarProps {
  currentStage: WorkflowStage;
  progress: number;
}

const StageProgressBar: React.FC<StageProgressBarProps> = ({
  currentStage,
  progress,
}) => {
  const currentIndex = ORDERED_STAGES.indexOf(currentStage);

  return (
    <div className={styles.wrapper}>
      <div className={styles.stages}>
        {ORDERED_STAGES.map((stage, idx) => {
          const isDone    = idx < currentIndex;
          const isActive  = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <React.Fragment key={stage}>
              <div
                className={`${styles.step} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''} ${isPending ? styles.pending : ''}`}
              >
                <div className={styles.dot}>
                  {isDone && <span aria-hidden="true">✓</span>}
                  {isActive && <span className={styles.pulse} aria-hidden="true" />}
                </div>
                <span className={styles.stepLabel}>
                  {WORKFLOW_STAGE_LABELS[stage]}
                </span>
              </div>

              {idx < ORDERED_STAGES.length - 1 && (
                <div
                  className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default StageProgressBar;
