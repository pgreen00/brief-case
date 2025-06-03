declare type Right =
  'case_groups:write' |
  'case_groups:read' |
  'cases:write' |
  'cases:read' |
  'users:write' |
  'users:read' |
  'businesses:write' |
  'businesses:read' |
  'appointments:write' |
  'appointments:read' |
  'business_notes:write' |
  'business_notes:read' |
  'messages:write' |
  'messages:read';

declare type Role = 'client' | 'employee' | 'superuser';

declare type User = {
  business_id: number;
  user_id: number;
  user_role: Role;
  rights: Right[];
  id: string;
  last_modified: Date;
}

declare type Business = {
  id: number;
  business_name: string;
  display_name: string;
  last_modified: Date;
}

declare type FeatureFlag = {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
}

type CaseGroup = {
  id: number;
  title: string;
  business_id: number;
  description: string | null;
  parent_id: number | null;
  group_rank: number | null;
  automations: Record<string, string> | null;
  last_modified: Date;
}
