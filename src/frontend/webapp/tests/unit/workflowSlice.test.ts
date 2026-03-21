import workflowReducer, {
  startJob,
  advanceStage,
  appendLog,
  updateFileStatus,
  setError,
  resetWorkflow,
} from '../../src/application/workflow/workflowSlice';

const initialState = workflowReducer(undefined, { type: '@@INIT' });

const sampleFiles = [
  { name: 'contract.pdf', type: 'PDF' as const, status: 'pending' as const },
  { name: 'annex.docx',   type: 'DOCX' as const, status: 'pending' as const },
];

describe('workflowSlice', () => {
  it('starts with idle stage and zero progress', () => {
    expect(initialState.stage).toBe('idle');
    expect(initialState.progress).toBe(0);
  });

  it('startJob sets jobId, files, and advances to ingestion', () => {
    const state = workflowReducer(
      initialState,
      startJob({ jobId: 'job-42', files: sampleFiles })
    );
    expect(state.jobId).toBe('job-42');
    expect(state.stage).toBe('ingestion');
    expect(state.progress).toBe(10);
    expect(state.files).toHaveLength(2);
    expect(state.error).toBeNull();
  });

  it('advanceStage updates stage and progress', () => {
    let state = workflowReducer(initialState, startJob({ jobId: 'j', files: [] }));
    state = workflowReducer(state, advanceStage('ocr'));
    expect(state.stage).toBe('ocr');
    expect(state.progress).toBe(30);
  });

  it('appendLog adds a timestamped entry', () => {
    let state = workflowReducer(initialState, startJob({ jobId: 'j', files: [] }));
    state = workflowReducer(state, appendLog('OCR page 3/12…'));
    expect(state.logs).toHaveLength(1);
    expect(state.logs[0].message).toBe('OCR page 3/12…');
    expect(state.logs[0].timestamp).toBeTruthy();
  });

  it('updateFileStatus changes a file status by name', () => {
    let state = workflowReducer(
      initialState,
      startJob({ jobId: 'j', files: sampleFiles })
    );
    state = workflowReducer(
      state,
      updateFileStatus({ name: 'contract.pdf', status: 'done' })
    );
    expect(state.files.find((f) => f.name === 'contract.pdf')?.status).toBe('done');
    expect(state.files.find((f) => f.name === 'annex.docx')?.status).toBe('pending');
  });

  it('setError sets stage to failed and records the error', () => {
    let state = workflowReducer(initialState, startJob({ jobId: 'j', files: [] }));
    state = workflowReducer(state, setError('OCR timeout'));
    expect(state.stage).toBe('failed');
    expect(state.error).toBe('OCR timeout');
  });

  it('resetWorkflow returns to initial state', () => {
    let state = workflowReducer(
      initialState,
      startJob({ jobId: 'j', files: sampleFiles })
    );
    state = workflowReducer(state, advanceStage('extraction'));
    state = workflowReducer(state, resetWorkflow());
    expect(state).toEqual(initialState);
  });
});
