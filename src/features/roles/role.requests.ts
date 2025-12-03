export interface CreateRolePermissionRequest {
  role_id: string;
  permission_id: string;
}

export interface UpdateRolePermissionRequest {
  role_id?: string;
  permission_id?: string;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name?: string;
}
