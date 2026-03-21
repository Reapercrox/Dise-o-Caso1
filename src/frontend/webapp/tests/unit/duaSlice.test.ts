import duaReducer, {
  setDocument,
  updateField,
  resetFieldToAI,
  selectField,
  setIssues,
  markIssueReviewed,
  ignoreIssue,
  clearDocument,
} from '../../src/domain/dua/duaSlice';
import type { DUADocument } from '../../src/domain/dua/DUATypes';

const makeDocument = (): DUADocument => ({
  id: 'doc-1',
  jobId: 'job-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sections: [
    {
      key: 'general',
      label: 'General',
      fields: [
        {
          id: 'f-1',
          label: 'Contract Number',
          value: 'CN-2025-001',
          aiSuggestion: 'CN-2025-001',
          confidence: 'green',
          confidenceScore: 92,
          confidenceReason: 'Found in header of all documents',
          evidence: [],
          isEdited: false,
        },
      ],
    },
  ],
});

const initialState = duaReducer(undefined, { type: '@@INIT' });

describe('duaSlice', () => {
  it('starts with null document', () => {
    expect(initialState.document).toBeNull();
    expect(initialState.selectedFieldId).toBeNull();
    expect(initialState.issues).toHaveLength(0);
  });

  it('setDocument stores the document', () => {
    const doc   = makeDocument();
    const state = duaReducer(initialState, setDocument(doc));
    expect(state.document?.id).toBe('doc-1');
  });

  it('updateField changes value and marks isEdited=true', () => {
    let state = duaReducer(initialState, setDocument(makeDocument()));
    state = duaReducer(state, updateField({ fieldId: 'f-1', value: 'CN-2025-999' }));
    const field = state.document!.sections[0].fields[0];
    expect(field.value).toBe('CN-2025-999');
    expect(field.isEdited).toBe(true);
  });

  it('updateField keeps isEdited=false when value matches AI suggestion', () => {
    let state = duaReducer(initialState, setDocument(makeDocument()));
    state = duaReducer(state, updateField({ fieldId: 'f-1', value: 'CN-2025-001' }));
    expect(state.document!.sections[0].fields[0].isEdited).toBe(false);
  });

  it('resetFieldToAI restores AI suggestion and clears isEdited', () => {
    let state = duaReducer(initialState, setDocument(makeDocument()));
    state = duaReducer(state, updateField({ fieldId: 'f-1', value: 'MODIFIED' }));
    state = duaReducer(state, resetFieldToAI({ fieldId: 'f-1' }));
    const field = state.document!.sections[0].fields[0];
    expect(field.value).toBe('CN-2025-001');
    expect(field.isEdited).toBe(false);
  });

  it('selectField sets selectedFieldId', () => {
    let state = duaReducer(initialState, selectField('f-1'));
    expect(state.selectedFieldId).toBe('f-1');
    state = duaReducer(state, selectField(null));
    expect(state.selectedFieldId).toBeNull();
  });

  it('markIssueReviewed changes status to reviewed', () => {
    let state = duaReducer(
      initialState,
      setIssues([{ id: 'i-1', fieldId: 'f-1', severity: 'error', message: 'Bad', status: 'open' }])
    );
    state = duaReducer(state, markIssueReviewed('i-1'));
    expect(state.issues[0].status).toBe('reviewed');
  });

  it('ignoreIssue sets status and stores reason', () => {
    let state = duaReducer(
      initialState,
      setIssues([{ id: 'i-2', fieldId: 'f-1', severity: 'warning', message: 'Warn', status: 'open' }])
    );
    state = duaReducer(state, ignoreIssue({ id: 'i-2', reason: 'Intentional' }));
    expect(state.issues[0].status).toBe('ignored');
    expect(state.issues[0].ignoreReason).toBe('Intentional');
  });

  it('clearDocument resets everything', () => {
    let state = duaReducer(initialState, setDocument(makeDocument()));
    state = duaReducer(state, clearDocument());
    expect(state.document).toBeNull();
    expect(state.selectedFieldId).toBeNull();
    expect(state.issues).toHaveLength(0);
  });
});
