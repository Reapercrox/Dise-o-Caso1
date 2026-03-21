export type ConfidenceLevel = 'green' | 'yellow' | 'red';

export interface Evidence {
  fileName: string;
  pageNumber: number;
  snippet: string;
}

export interface DUAField {
  id: string;
  label: string;
  value: string;
  /** Original AI-suggested value — used for undo/reset */
  aiSuggestion: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0–100
  confidenceReason: string;
  evidence: Evidence[];
  isEdited: boolean;
}

export type DUASectionKey =
  | 'general'
  | 'parties'
  | 'financial'
  | 'dates'
  | 'terms';

export interface DUASection {
  key: DUASectionKey;
  label: string;
  fields: DUAField[];
}

export interface DUADocument {
  id: string;
  jobId: string;
  sections: DUASection[];
  createdAt: string;
  updatedAt: string;
}
