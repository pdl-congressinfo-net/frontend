export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name?: string;
}

export interface CreateRolePermissionRequest {
  role_id: string;
  permission_id: string;
}
