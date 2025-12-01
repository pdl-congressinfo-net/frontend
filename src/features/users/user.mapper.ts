import { UserDTO, UserRoleDTO, UserPermissionDTO } from "./user.responses";
import { User, UserRole, UserPermission } from "./user.model";

export function mapUserRole(dto: UserRoleDTO): UserRole {
    return {
        id: dto.id,
        userId: dto.user_id,
        roleId: dto.role_id,
    };
}

export function mapUserPermission(dto: UserPermissionDTO): UserPermission {
    return {
        id: dto.id,
        userId: dto.user_id,
        permissionId: dto.permission_id,
    };
}

export function mapUser(dto: UserDTO): User {
    return {
        id: dto.id,
        email: dto.email,
        fullName: dto.full_name,
        createdAt: dto.created_at,
        lastLogin: dto.last_login,
    };
}