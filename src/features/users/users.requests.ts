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
  contact?: {
    titles?: string;
    first_name: string;
    last_name?: string;
    phone_number?: string;
  };
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  contact?: {
    titles?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
}

export interface CreateContactRequest {
  email: string;
  titles?: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
}

export interface UpdateContactRequest {
  email?: string;
  titles?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}
