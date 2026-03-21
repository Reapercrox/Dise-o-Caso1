import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../presentation/hooks/useAppDispatch';
import { updateField, resetFieldToAI, selectField } from '../../../domain/dua/duaSlice';
import Badge from '../atoms/Badge/Badge';
import Button from '../atoms/Button/Button';
import type { DUAField } from '../../../domain/dua/DUATypes';
import styles from './DUAFieldRow.module.css';

interface DUAFieldRowProps {
  field: DUAField;
  isSelected: boolean;
}

const DUAFieldRow: React.FC<DUAFieldRowProps> = ({ field, isSelected }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [editValue, setEditValue] = useState(field.value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelect = () => dispatch(selectField(field.id));

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    dispatch(updateField({ fieldId: field.id, value: editValue }));
    setIsEditing(false);
  };

  const handleReset = () => {
    dispatch(resetFieldToAI({ fieldId: field.id }));
    setEditValue(field.aiSuggestion);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div
      className={`${styles.row} ${isSelected ? styles.selected : ''}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
    >
      <div className={styles.meta}>
        <span className={styles.label}>{field.label}</span>
        <Badge
          level={field.confidence}
          score={field.confidenceScore}
        />
        {field.isEdited && (
          <span className={styles.editedTag}>Edited</span>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editRow} onClick={(e) => e.stopPropagation()}>
          <input
            className={styles.editInput}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button size="sm" onClick={handleSave}>{t('common.save')}</Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </div>
      ) : (
        <div className={styles.valueRow}>
          <span className={styles.value}>{field.value || '—'}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
          >
            Edit
          </Button>
        </div>
      )}

      <p className={styles.reason}>{field.confidenceReason}</p>
    </div>
  );
};

export default DUAFieldRow;
