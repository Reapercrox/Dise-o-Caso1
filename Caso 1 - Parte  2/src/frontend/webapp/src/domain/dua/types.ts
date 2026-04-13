export type PipelineStage =
  | "ingestion"
  | "ocr"
  | "extraction"
  | "mapping"
  | "validation"
  | "export";

export type ConfidenceLevel = "high" | "medium" | "low";

export type DuaFieldView = {
  key: string;
  labelKey: string;
  value: string;
  level: ConfidenceLevel;
  confidencePct: number;
  source?: { file: string; page?: number; snippet: string };
};
