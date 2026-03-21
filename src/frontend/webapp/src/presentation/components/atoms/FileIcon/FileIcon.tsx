import React from 'react';
import type { FileType } from '../../../../shared/types/common';
import styles from './FileIcon.module.css';

const icons: Record<FileType, string> = {
  PDF:  '📄',
  DOCX: '📝',
  XLSX: '📊',
  IMG:  '🖼️',
};

const colors: Record<FileType, string> = {
  PDF:  '#e63946',
  DOCX: '#2b6cb0',
  XLSX: '#276749',
  IMG:  '#805ad5',
};

interface FileIconProps {
  type: FileType;
  size?: 'sm' | 'md' | 'lg';
}

const FileIcon: React.FC<FileIconProps> = ({ type, size = 'md' }) => (
  <span
    className={`${styles.icon} ${styles[size]}`}
    style={{ background: `${colors[type]}18`, color: colors[type] }}
    aria-label={type}
    title={type}
  >
    {icons[type]}
  </span>
);

export default FileIcon;
