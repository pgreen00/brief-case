export type Role = 'client' | 'employee' | 'superuser';

export const rights = [
  'user:delete',
  'user:edit',
  'user:read',
  'user:create',
  'case:updateTags',
  'case:updateStatus',
  'task:create',
  'task:update',
  'task:delete',
  'task:getAll'
] as const;

export type Right = typeof rights[number];

export type BusinessUser = {
  business_id: number;
  user_id: number;
  user_role: Role;
  rights: Right[];
  id: string;
  last_modified: Date;
}
