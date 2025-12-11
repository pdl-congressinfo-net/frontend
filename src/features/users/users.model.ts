export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  lastLogin: Date;
  oekaId?: string;
}
