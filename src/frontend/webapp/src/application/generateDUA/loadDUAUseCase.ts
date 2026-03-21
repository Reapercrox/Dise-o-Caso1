import { store } from '../../app/store';
import { httpClient } from '../../infrastructure/api/httpClient';
import { setDocument, setIssues } from '../../domain/dua/duaSlice';
import { runValidation } from '../validation/validationStrategies';
import { appInsights } from '../../infrastructure/observability/appInsights';
import type { DUADocument } from '../../domain/dua/DUATypes';

/**
 * Mediator use case: orchestrates fetching the extracted DUA,
 * running client-side validation, and updating the store.
 */
export const loadDUAUseCase = async (jobId: string): Promise<void> => {
  try {
    const doc = await httpClient.get<DUADocument>(`/api/jobs/${jobId}/dua`);

    store.dispatch(setDocument(doc));

    const issues = runValidation(doc);
    store.dispatch(setIssues(issues));

    appInsights.trackEvent('dua_loaded', {
      jobId,
      fieldCount: doc.sections.flatMap((s) => s.fields).length,
      issueCount: issues.length,
    });
  } catch (err: unknown) {
    appInsights.trackEvent('dua_load_failed', { jobId });
    throw err;
  }
};
