export const eventCategoryResource = {
  name: "event-categories",
  list: "/event-categories",
  create: "/event-categories",
  edit: "/event-categories/edit/:id",
  show: "/event-categories/show/:id",
  meta: {
    canDelete: true,
  },
};

export const eventTypeResource = {
  name: "event-types",
  list: "/event-types",
  create: "/event-types",
  edit: "/event-types/edit/:id",
  show: "/event-types/show/:id",
  meta: {
    canDelete: true,
  },
};

export const eventResource = {
  name: "events",
  list: "/events",
  create: "/events",
  edit: "/events/edit/:id",
  show: "/events/show/:id",
  meta: {
    canDelete: true,
  },
};
