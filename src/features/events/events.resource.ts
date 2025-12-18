export const eventTypeResource = {
  name: "types",
  list: "/admin/events/types",
  create: "/admin/events/types",
  edit: "/admin/events/types/edit/:id",
  meta: {
    canDelete: true,
    parentModule: "events",
  },
};

export const eventResource = {
  name: "events",
  list: "/admin/events",
  create: "/admin/events/create",
  edit: "/admin/events/edit/:id",
  show: "/admin/events/show/:id",
  meta: {
    canDelete: true,
  },
};
