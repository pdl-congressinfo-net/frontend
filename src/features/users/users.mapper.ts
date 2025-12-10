import { UserDTO, UserRoleDTO, UserPermissionDTO } from "./users.responses";
import { User, UserRole, UserPermission } from "./users.model";

export default {
  users: (dto: UserDTO): User => ({
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    createdAt: dto.created_at,
    lastLogin: dto.last_login,
  }),
  roles: (dto: UserRoleDTO): UserRole => ({
    id: dto.id,
    userId: dto.user_id,
    roleId: dto.role_id,
  }),
  permissions: (dto: UserPermissionDTO): UserPermission => ({
    id: dto.id,
    userId: dto.user_id,
    permissionId: dto.permission_id,
  }),
};
