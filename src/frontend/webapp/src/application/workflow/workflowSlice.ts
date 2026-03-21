import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WorkflowStage =
  | 'idle'
  | 'ingestion'
  | 'ocr'
  | 'extraction'
  | 'mapping'
  | 'validation'
  | 'word'
  | 'complete'
  | 'failed';

export interface WorkflowLog {
  timestamp: string;
  message: string;
}

export interface DetectedFile {
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  status: 'pending' | 'processing' | 'done' | 'error';
}

interface WorkflowState {
  jobId: string | null;
  stage: WorkflowStage;
  progress: number; // 0–100
  logs: WorkflowLog[];
  files: DetectedFile[];
  error: string | null;
}

const initialState: WorkflowState = {
  jobId: null,
  stage: 'idle',
  progress: 0,
  logs: [],
  files: [],
  error: null,
};

const stageProgressMap: Record<WorkflowStage, number> = {
  idle: 0,
  ingestion: 10,
  ocr: 30,
  extraction: 50,
  mapping: 65,
  validation: 80,
  word: 95,
  complete: 100,
  failed: 0,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    startJob(state, action: PayloadAction<{ jobId: string; files: DetectedFile[] }>) {
      state.jobId = action.payload.jobId;
      state.files = action.payload.files;
      state.stage = 'ingestion';
      state.progress = stageProgressMap.ingestion;
      state.logs = [];
      state.error = null;
    },
    advanceStage(state, action: PayloadAction<WorkflowStage>) {
      state.stage = action.payload;
      state.progress = stageProgressMap[action.payload];
    },
    appendLog(state, action: PayloadAction<string>) {
      state.logs.push({
        timestamp: new Date().toISOString(),
        message: action.payload,
      });
    },
    updateFileStatus(
      state,
      action: PayloadAction<{ name: string; status: DetectedFile['status'] }>
    ) {
      const file = state.files.find((f) => f.name === action.payload.name);
      if (file) file.status = action.payload.status;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.stage = 'failed';
    },
    resetWorkflow() {
      return initialState;
    },
  },
});

export const {
  startJob,
  advanceStage,
  appendLog,
  updateFileStatus,
  setError,
  resetWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;
