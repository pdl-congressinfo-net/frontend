export interface Role {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}
