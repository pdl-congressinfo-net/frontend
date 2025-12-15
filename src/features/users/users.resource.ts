export const userRoleRessource = {
  name: "user-roles",
  list: "/user-roles",
  create: "/user-roles",
  edit: "/user-roles/edit/:id",
  show: "/user-roles/show/:id",
  meta: {
    canDelete: true,
  },
};

export const userPermissionRessource = {
  name: "user-permissions",
  list: "/user-permissions",
  create: "/user-permissions",
  edit: "/user-permissions/edit/:id",
  show: "/user-permissions/show/:id",
  meta: {
    canDelete: true,
  },
};

export const userRessource = {
  name: "users",
  list: "/admin/users",
  create: "/admin/users",
  edit: "/admin/users/edit/:id",
  show: "/admin/users/show/:id",
  meta: {
    canDelete: true,
  },
};
