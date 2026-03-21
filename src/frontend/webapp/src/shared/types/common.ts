/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/** Generic paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** File type union used throughout the app */
export type FileType = 'PDF' | 'DOCX' | 'XLSX' | 'IMG';

/** Traffic-light confidence levels */
export type ConfidenceLevel = 'green' | 'yellow' | 'red';
