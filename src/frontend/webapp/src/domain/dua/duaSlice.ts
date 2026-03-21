import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DUADocument, DUAField } from './DUATypes';

interface DUAState {
  document: DUADocument | null;
  selectedFieldId: string | null;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  id: string;
  fieldId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  status: 'open' | 'reviewed' | 'ignored';
  ignoreReason?: string;
}

const initialState: DUAState = {
  document: null,
  selectedFieldId: null,
  issues: [],
};

const duaSlice = createSlice({
  name: 'dua',
  initialState,
  reducers: {
    setDocument(state, action: PayloadAction<DUADocument>) {
      state.document = action.payload;
    },
    updateField(
      state,
      action: PayloadAction<{ fieldId: string; value: string }>
    ) {
      if (!state.document) return;
      for (const section of state.document.sections) {
        const field = section.fields.find((f) => f.id === action.payload.fieldId);
        if (field) {
          field.value = action.payload.value;
          field.isEdited = field.value !== field.aiSuggestion;
          break;
        }
      }
    },
    resetFieldToAI(state, action: PayloadAction<{ fieldId: string }>) {
      if (!state.document) return;
      for (const section of state.document.sections) {
        const field = section.fields.find((f) => f.id === action.payload.fieldId);
        if (field) {
          field.value = field.aiSuggestion;
          field.isEdited = false;
          break;
        }
      }
    },
    selectField(state, action: PayloadAction<string | null>) {
      state.selectedFieldId = action.payload;
    },
    setIssues(state, action: PayloadAction<ValidationIssue[]>) {
      state.issues = action.payload;
    },
    markIssueReviewed(state, action: PayloadAction<string>) {
      const issue = state.issues.find((i) => i.id === action.payload);
      if (issue) issue.status = 'reviewed';
    },
    ignoreIssue(
      state,
      action: PayloadAction<{ id: string; reason: string }>
    ) {
      const issue = state.issues.find((i) => i.id === action.payload.id);
      if (issue) {
        issue.status = 'ignored';
        issue.ignoreReason = action.payload.reason;
      }
    },
    clearDocument(state) {
      state.document = null;
      state.selectedFieldId = null;
      state.issues = [];
    },
  },
});

export const {
  setDocument,
  updateField,
  resetFieldToAI,
  selectField,
  setIssues,
  markIssueReviewed,
  ignoreIssue,
  clearDocument,
} = duaSlice.actions;

export default duaSlice.reducer;
