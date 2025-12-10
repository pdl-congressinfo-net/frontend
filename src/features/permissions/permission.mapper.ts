import { PermissionDTO } from "./permission.responses";
import { Permission } from "./permission.model";

export default {
  permissions: (dto: PermissionDTO): Permission => ({
    id: dto.id,
    name: dto.name,
  }),
};
