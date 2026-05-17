export type RolePermission = {
  id: number;
  role_id: number;
  role_name?: string;
  menu_id: number;
  menu_name?: string;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
  created_at: string;
  updated_at: string;
};
