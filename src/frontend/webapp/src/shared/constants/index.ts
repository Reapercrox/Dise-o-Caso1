export const SUPPORTED_FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'IMG'] as const;

export const WORKFLOW_STAGE_LABELS: Record<string, string> = {
  idle: 'Ready',
  ingestion: 'Ingestion',
  ocr: 'OCR Processing',
  extraction: 'Data Extraction',
  mapping: 'Field Mapping',
  validation: 'Validation',
  word: 'Generating Word',
  complete: 'Complete',
  failed: 'Failed',
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  green: 'High confidence',
  yellow: 'Medium confidence',
  red: 'Low confidence',
};

export const APP_NAME = 'DUA Generator';
