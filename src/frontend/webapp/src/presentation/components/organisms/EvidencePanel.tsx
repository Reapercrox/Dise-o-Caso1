import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/useAppSelector';
import styles from './EvidencePanel.module.css';

const EvidencePanel: React.FC = () => {
  const { t } = useTranslation();
  const document      = useAppSelector((s) => s.dua.document);
  const selectedFieldId = useAppSelector((s) => s.dua.selectedFieldId);

  const selectedField = document?.sections
    .flatMap((s) => s.fields)
    .find((f) => f.id === selectedFieldId);

  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>{t('dua.evidence')}</h2>

      {!selectedField && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <p>Select a field to see its source evidence.</p>
        </div>
      )}

      {selectedField && (
        <>
          <div className={styles.fieldHeader}>
            <span className={styles.fieldName}>{selectedField.label}</span>
            <span className={styles.fieldValue}>{selectedField.value}</span>
          </div>

          <div className={styles.reason}>
            <span className={styles.reasonLabel}>Confidence reason</span>
            <p>{selectedField.confidenceReason}</p>
          </div>

          <div className={styles.evidenceList}>
            <span className={styles.evidenceTitle}>Source documents</span>
            {selectedField.evidence.length === 0 && (
              <p className={styles.noEvidence}>No evidence linked.</p>
            )}
            {selectedField.evidence.map((ev, idx) => (
              <div key={idx} className={styles.evidenceItem}>
                <div className={styles.evidenceMeta}>
                  <span className={styles.fileName}>{ev.fileName}</span>
                  <span className={styles.page}>p. {ev.pageNumber}</span>
                </div>
                <blockquote className={styles.snippet}>
                  {ev.snippet}
                </blockquote>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default EvidencePanel;
