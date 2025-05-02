export type CaseFile = {
  id: number;
  case_id: number;
  file_name: string;
  s3_path: string | null;
  parent_id: number | null;
  file_size: string | null;
  last_modified: Date;
}
