export const roleResource = {
  name: "roles",
  list: "/roles",
  create: "/roles/create",
  edit: "/roles/edit/:id",
  show: "/roles/show/:id",
  meta: {
    canDelete: true,
  },
};

export const rolePermissionResource = {
  name: "rolepermissions",
  list: "/roles/:roleId/permissions",
  create: "/roles/:roleId/permissions/create",
  meta: {
    canDelete: true,
    parent: "roles",
  },
};