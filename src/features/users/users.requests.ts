export interface CreateUserRoleRequest {
  user_id: string;
  role_id: string;
}

export interface UpdateUserRoleRequest {
  user_id?: string;
  role_id?: string;
}

export interface CreateUserPermissionRequest {
  user_id: string;
  permission_id: string;
}

export interface UpdateUserPermissionRequest {
  user_id?: string;
  permission_id?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  titles?: string;
  first_name: string;
  last_name?: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  titles?: string;
  first_name?: string;
  last_name?: string;
}
