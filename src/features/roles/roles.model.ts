export interface Role {
  id: string;
  name: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}
