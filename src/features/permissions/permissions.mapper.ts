import { PermissionDTO } from "./permissions.responses";
import { Permission } from "./permissions.model";

export const mapPermission = (dto: PermissionDTO): Permission => ({
  id: dto.id,
  name: dto.name,
});

export default {
  permissions: mapPermission,
};
