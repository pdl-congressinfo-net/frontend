export const permissionResource = {
  name: "permissions",
  list: "/admin/permissions",
  create: "/admin/permissions/create",
  edit: "/admin/permissions/edit/:id",
  show: "/admin/permissions/show/:id",
  meta: {
    canDelete: true,
  },
};
