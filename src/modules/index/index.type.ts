export interface AnalizeFileColumns {
  filename: string;
  keyword: string;
}

export interface SanitizeDB {
  /* column names */
  columns: string[];
  /* column names to filter */
  filter: string[];
}
