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
  created_at: string;
  last_login: string | null;
  oeak_id?: number;
  contact?: {
    id?: string;
    email?: string;
    titles?: string;
    first_name: string;
    last_name?: string;
    phone_number?: string;
    created_at?: string;
  } | null;
}

export interface ContactDTO {
  id: string;
  email: string;
  titles?: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  created_at: string;
}
