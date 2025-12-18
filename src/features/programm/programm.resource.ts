export const programmResource = {
  name: "programm",
  list: "/admin/programm",
  create: "/admin/programm/create",
  edit: "/admin/programm/edit/:id",
  show: "/admin/programm/show/:id",
  meta: {
    canDelete: true,
  },
};

export const eventSessionResource = {
  name: "sessions",
  list: "/admin/programm/sessions",
  create: "/admin/programm/sessions/create",
  edit: "/admin/programm/sessions/edit/:id",
  show: "/admin/programm/sessions/show/:id",
  meta: {
    canDelete: true,
    parentModule: "programm",
  },
};
