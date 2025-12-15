export interface RoleDTO {
  id: string;
  name: string;
  is_default: boolean;
}

export interface RolePermissionDTO {
  role_id: string;
  permission_id: string;
}
