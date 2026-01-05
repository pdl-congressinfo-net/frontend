export const userRessource = {
  name: "users",
  list: "/admin/users",
  create: "/admin/users/create",
  edit: "/admin/users/edit/:id",
  show: "/admin/users/show/:id",
  meta: {
    canDelete: true,
  },
};

export const contactsResource = {
  name: "contacts",
  list: "/admin/contacts",
  create: "/admin/contacts/create",
  edit: "/admin/contacts/edit/:id",
  show: "/admin/contacts/show/:id",
};
