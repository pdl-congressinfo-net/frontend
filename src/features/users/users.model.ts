export interface UserRole {
  userId: string;
  roleId: string;
}

export interface UserPermission {
  userId: string;
  permissionId: string;
}

export interface Contact {
  id?: string;
  email?: string;
  titles?: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string | null;
  oeakId?: number;
  contact?: Contact | null;
}
