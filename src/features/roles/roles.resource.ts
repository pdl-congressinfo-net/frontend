export const roleResource = {
  name: "roles",
  list: "/admin/roles",
  create: "/admin/roles/create",
  edit: "/admin/roles/edit/:id",
  show: "/admin/roles/show/:id",
  meta: {
    canDelete: true,
  },
};

export const rolePermissionResource = {
  name: "rolepermissions",
  list: "/admin/roles/:roleId/permissions",
  create: "/admin/roles/:roleId/permissions/create",
  meta: {
    canDelete: true,
    parent: "roles",
  },
};
