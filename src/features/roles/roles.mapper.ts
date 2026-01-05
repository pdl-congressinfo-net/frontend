import { Role, RolePermission } from "./roles.model";
import { RoleDTO, RolePermissionDTO } from "./roles.responses";

export const mapRole = (dto: RoleDTO): Role => ({
  id: dto.id,
  name: dto.name,
  isDefault: dto.is_default,
});

export const mapRolePermission = (dto: RolePermissionDTO): RolePermission => ({
  roleId: dto.role_id,
  permissionId: dto.permission_id,
});

export default {
  roles: mapRole,
  permissions: mapRolePermission,
};
