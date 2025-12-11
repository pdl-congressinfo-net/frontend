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
  fullName: string;
  createdAt: Date;
  lastLogin: Date;
  oekaId?: string;
}
