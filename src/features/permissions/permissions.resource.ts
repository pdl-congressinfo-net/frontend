export const permissionResource = {
  name: "permissions",
  list: "/permissions",
  create: "/permissions/create",
  edit: "/permissions/edit/:id",
  show: "/permissions/show/:id",
  meta: {
    canDelete: true,
  },
};
