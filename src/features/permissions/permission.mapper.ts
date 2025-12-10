import { PermissionDTO } from "./permission.responses";
import { Permission } from "./permission.model";

export const mapPermission = (dtos: PermissionDTO): Permission => {
  return {
    id: dtos.id,
    name: dtos.name,
  };
};
