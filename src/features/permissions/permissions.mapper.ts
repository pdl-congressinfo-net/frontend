import { Permission } from "./permissions.model";
import { PermissionDTO } from "./permissions.responses";

export const mapPermission = (dto: PermissionDTO): Permission => ({
  id: dto.id,
  name: dto.name,
});

export default {
  permissions: mapPermission,
};
