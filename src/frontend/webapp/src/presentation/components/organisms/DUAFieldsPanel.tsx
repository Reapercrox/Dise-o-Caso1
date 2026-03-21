import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/useAppSelector';
import DUAFieldRow from '../molecules/DUAFieldRow';
import styles from './DUAFieldsPanel.module.css';

const DUAFieldsPanel: React.FC = () => {
  const { t } = useTranslation();
  const document      = useAppSelector((s) => s.dua.document);
  const selectedFieldId = useAppSelector((s) => s.dua.selectedFieldId);

  if (!document) return null;

  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>{t('dua.fields')}</h2>

      {document.sections.map((section) => (
        <section key={section.key} className={styles.section}>
          <h3 className={styles.sectionLabel}>{section.label}</h3>
          <div className={styles.fields}>
            {section.fields.map((field) => (
              <DUAFieldRow
                key={field.id}
                field={field}
                isSelected={field.id === selectedFieldId}
              />
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
};

export default DUAFieldsPanel;
