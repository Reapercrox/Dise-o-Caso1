import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  analyzeCommand,
  cancelCommand,
  retryOCRCommand,
  generateWordCommand,
} from '../../application/workflow/workflowCommands';
import type { DetectedFile } from '../../application/workflow/workflowSlice';

/**
 * Observer hook — UI subscribes to workflow state and gets command callbacks.
 * Keeps all workflow-related logic out of page components.
 */
export const useWorkflow = () => {
  const dispatch = useAppDispatch();
  const { stage, progress, logs, files, error, jobId } = useAppSelector(
    (s) => s.workflow
  );

  return {
    stage,
    progress,
    logs,
    files,
    error,
    jobId,
    isRunning: stage !== 'idle' && stage !== 'complete' && stage !== 'failed',
    isComplete: stage === 'complete',
    isFailed: stage === 'failed',

    analyze: (detectedFiles: DetectedFile[]) => analyzeCommand(detectedFiles),
    cancel: () => jobId && cancelCommand(jobId),
    retryOCR: () => jobId && retryOCRCommand(jobId),
    generateWord: () => jobId && generateWordCommand(jobId),
  };
};
