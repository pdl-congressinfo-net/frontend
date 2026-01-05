export const programmResource = {
  name: "programm",
  list: "/admin/events/:eventId/programm",
  edit: "/admin/events/:eventId/programm/edit/:id",
  meta: {
    canDelete: true,
  },
};

export const eventSessionResource = {
  name: "sessions",
  list: "/admin/events/:eventId/programm",
  edit: "/admin/events/:eventId/sessions/edit/:id",
  meta: {
    canDelete: true,
    parentModule: "programm",
  },
};
