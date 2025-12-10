export interface UserRoleDTO {
  id: string;
  user_id: string;
  role_id: string;
}

export interface UserPermissionDTO {
    id: string;
    user_id: string;
    permission_id: string;
}

export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  created_at: Date;
  last_login: Date;
}
