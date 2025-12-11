import { User, UserPermission, UserRole } from "./users.model";
import { UserDTO, UserPermissionDTO, UserRoleDTO } from "./users.responses";

export default {
  users: (dto: UserDTO): User => ({
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    createdAt: dto.created_at,
    lastLogin: dto.last_login,
  }),
  roles: (dto: UserRoleDTO): UserRole => ({
    userId: dto.user_id,
    roleId: dto.role_id,
  }),
  permissions: (dto: UserPermissionDTO): UserPermission => ({
    userId: dto.user_id,
    permissionId: dto.permission_id,
  }),
};
