export interface AnalizeFileColumns {
  filename: string;
  keyword: string;
}

export interface SanitizeDB extends AnalizeFileColumns {
  /* column names */
  columns: string[];
  /* column names to filter */
  filter: string[];
}
