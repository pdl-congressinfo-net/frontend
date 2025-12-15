export interface CreateRoleRequest {
  name: string;
  is_default?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  is_default?: boolean;
}

export interface CreateRolePermissionRequest {
  role_id: string;
  permission_id: string;
}
