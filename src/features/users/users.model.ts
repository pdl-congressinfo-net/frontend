export interface UserRole {
  userId: string;
  roleId: string;
}

export interface UserPermission {
  userId: string;
  permissionId: string;
}

export interface User {
  id: string;
  email: string;
  titles?: string;
  firstName: string;
  lastName?: string;
  createdAt: Date;
  lastLogin: Date;
  oeakId?: number;
}
