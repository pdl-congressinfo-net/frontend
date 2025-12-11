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
  list: "/users",
  create: "/users",
  edit: "/users/edit/:id",
  show: "/users/show/:id",
  meta: {
    canDelete: true,
  },
};
