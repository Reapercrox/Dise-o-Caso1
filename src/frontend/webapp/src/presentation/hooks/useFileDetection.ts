import { useState, useCallback } from 'react';
import { inferFileType } from '../../shared/utils';
import type { DetectedFile } from '../../application/workflow/workflowSlice';

export const useFileDetection = () => {
  const [files, setFiles] = useState<DetectedFile[]>([]);

  const handleFolderSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = Array.from(e.target.files ?? []);
      const detected: DetectedFile[] = raw.map((f) => ({
        name: f.name,
        type: inferFileType(f.name),
        status: 'pending',
      }));
      setFiles(detected);
    },
    []
  );

  const clearFiles = useCallback(() => setFiles([]), []);

  return { files, handleFolderSelect, clearFiles };
};
