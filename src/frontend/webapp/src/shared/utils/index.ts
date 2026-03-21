import type { FileType } from '../types/common';

/** Infer file type from extension */
export function inferFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toUpperCase();
  const map: Record<string, FileType> = {
    PDF: 'PDF',
    DOCX: 'DOCX',
    DOC: 'DOCX',
    XLSX: 'XLSX',
    XLS: 'XLSX',
    PNG: 'IMG',
    JPG: 'IMG',
    JPEG: 'IMG',
    TIFF: 'IMG',
  };
  return map[ext ?? ''] ?? 'PDF';
}

/** Format a date string as locale-aware short date */
export function formatDate(isoString: string, locale = 'en-US'): string {
  return new Date(isoString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Generate a stable colour from a string (for avatars, tags, etc.) */
export function stringToColour(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 45%)`;
}
