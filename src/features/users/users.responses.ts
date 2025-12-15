export interface UserRoleDTO {
  user_id: string;
  role_id: string;
}

export interface UserPermissionDTO {
  user_id: string;
  permission_id: string;
}

export interface UserDTO {
  id: string;
  email: string;
  titles?: string;
  first_name: string;
  last_name?: string;
  created_at: Date;
  last_login: Date;
  oeak_id?: number;
}
