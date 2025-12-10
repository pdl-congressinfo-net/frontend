import { RolePermissionDTO, RoleDTO } from "./role.responses";
import { RolePermission, Role } from "./role.model";

export default {
  permissions: (dto: RolePermissionDTO): RolePermission => ({
    roleId: dto.role_id,
    permissionId: dto.permission_id,
  }),
  roles: (dto: RoleDTO): Role => ({
    id: dto.id,
    name: dto.name,
  }),
};
