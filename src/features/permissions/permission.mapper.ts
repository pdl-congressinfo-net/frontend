import { PermissionDTO } from "../../features/permissions/permission.responses";
import { Permission } from "./permission.model";

export const mapPermission = (dtos: PermissionDTO): Permission => {
  return {
    id: dtos.id,
    name: dtos.name,
  };
};
