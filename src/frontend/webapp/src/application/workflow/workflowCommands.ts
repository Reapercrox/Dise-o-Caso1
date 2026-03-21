import { store } from '../../app/store';
import { httpClient } from '../../infrastructure/api/httpClient';
import { appInsights } from '../../infrastructure/observability/appInsights';
import {
  startJob,
  advanceStage,
  appendLog,
  setError,
  resetWorkflow,
} from './workflowSlice';
import type { DetectedFile } from './workflowSlice';
import { workflowSubscription } from './workflowSubscription';

/** Command: analyze selected folder and start the DUA workflow */
export const analyzeCommand = async (files: DetectedFile[]): Promise<void> => {
  const detectedFiles: DetectedFile[] = files.map((f) => ({
    ...f,
    status: 'pending',
  }));

  try {
    const { jobId } = await httpClient.post<{ jobId: string }>(
      '/api/jobs/start',
      { files: detectedFiles.map((f) => f.name) }
    );

    store.dispatch(startJob({ jobId, files: detectedFiles }));
    appInsights.trackEvent('job_started', { jobId });

    workflowSubscription.subscribe(jobId);
  } catch (err: unknown) {
    store.dispatch(setError((err as Error).message));
    appInsights.trackEvent('job_start_failed');
  }
};

/** Command: cancel an in-progress job */
export const cancelCommand = async (jobId: string): Promise<void> => {
  try {
    await httpClient.post(`/api/jobs/${jobId}/cancel`, {});
    store.dispatch(appendLog('Job cancelled by user.'));
    store.dispatch(resetWorkflow());
    workflowSubscription.unsubscribe();
    appInsights.trackEvent('job_cancelled', { jobId });
  } catch (err: unknown) {
    store.dispatch(setError((err as Error).message));
  }
};

/** Command: retry OCR for a failed stage */
export const retryOCRCommand = async (jobId: string): Promise<void> => {
  try {
    await httpClient.post(`/api/jobs/${jobId}/retry-ocr`, {});
    store.dispatch(advanceStage('ocr'));
    store.dispatch(appendLog('Retrying OCR…'));
    appInsights.trackEvent('ocr_retried', { jobId });
  } catch (err: unknown) {
    store.dispatch(setError((err as Error).message));
  }
};

/** Command: generate the final Word document */
export const generateWordCommand = async (jobId: string): Promise<void> => {
  try {
    store.dispatch(advanceStage('word'));
    const { downloadUrl } = await httpClient.post<{ downloadUrl: string }>(
      `/api/jobs/${jobId}/generate-word`,
      {}
    );
    store.dispatch(advanceStage('complete'));
    appInsights.trackEvent('dua_downloaded', { jobId });
    window.open(downloadUrl, '_blank');
  } catch (err: unknown) {
    store.dispatch(setError((err as Error).message));
  }
};
