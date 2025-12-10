import { RoleDTO, RolePermissionDTO } from "./roles.responses";
import { Role, RolePermission } from "./roles.model";

export const mapRole = (dto: RoleDTO): Role => ({
  id: dto.id,
  name: dto.name,
});

export const mapRolePermission = (dto: RolePermissionDTO): RolePermission => ({
  roleId: dto.role_id,
  permissionId: dto.permission_id,
});

export default {
  roles: mapRole,
  permissions: mapRolePermission,
};