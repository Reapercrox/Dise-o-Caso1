export type FileKind = "pdf" | "docx" | "xlsx" | "img" | "other";

export type DetectedFile = {
  name: string;
  kind: FileKind;
  size: number;
};
