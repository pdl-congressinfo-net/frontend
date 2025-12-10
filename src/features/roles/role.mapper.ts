import { RolePermissionDTO, RoleDTO } from "./role.responses";
import { RolePermission, Role } from "./role.model";

export function mapRolePermission(dto: RolePermissionDTO): RolePermission {
  return {
    roleId: dto.role_id,
    permissionId: dto.permission_id,
  };
}

export function mapRole(dto: RoleDTO): Role {
  return {
    id: dto.id,
    name: dto.name,
  };
}
