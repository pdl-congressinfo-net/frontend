import { Contact, User, UserPermission, UserRole } from "./users.model";
import {
  ContactDTO,
  UserDTO,
  UserPermissionDTO,
  UserRoleDTO,
} from "./users.responses";

export default {
  users: (dto: UserDTO): User => ({
    id: dto.id,
    email: dto.email,
    createdAt: dto.created_at,
    lastLogin: dto.last_login,
    oeakId: dto.oeak_id,
    contact: dto.contact
      ? {
          id: dto.contact.id,
          email: dto.contact.email,
          titles: dto.contact.titles,
          firstName: dto.contact.first_name,
          lastName: dto.contact.last_name,
          phoneNumber: dto.contact.phone_number,
          createdAt: dto.contact.created_at,
        }
      : null,
  }),
  roles: (dto: UserRoleDTO): UserRole => ({
    userId: dto.user_id,
    roleId: dto.role_id,
  }),
  permissions: (dto: UserPermissionDTO): UserPermission => ({
    userId: dto.user_id,
    permissionId: dto.permission_id,
  }),
  contacts: (dto: ContactDTO): Contact => ({
    id: dto.id,
    email: dto.email,
    titles: dto.titles,
    firstName: dto.first_name,
    lastName: dto.last_name,
    phoneNumber: dto.phone_number,
    createdAt: dto.created_at,
  }),
};
