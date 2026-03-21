import React from 'react';
import FileIcon from '../atoms/FileIcon/FileIcon';
import styles from './FileListItem.module.css';
import type { DetectedFile } from '../../../application/workflow/workflowSlice';

interface FileListItemProps {
  file: DetectedFile;
}

const statusLabel: Record<DetectedFile['status'], string> = {
  pending:    'Pending',
  processing: 'Processing…',
  done:       'Done',
  error:      'Error',
};

const FileListItem: React.FC<FileListItemProps> = ({ file }) => (
  <li className={`${styles.item} ${styles[file.status]}`}>
    <FileIcon type={file.type} size="sm" />
    <span className={styles.name}>{file.name}</span>
    <span className={styles.type}>{file.type}</span>
    <span className={styles.status}>{statusLabel[file.status]}</span>
  </li>
);

export default FileListItem;
