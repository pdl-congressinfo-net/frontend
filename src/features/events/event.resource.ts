export const eventCategoryResource = {
  name: "event-categories",
  list: "/events/categories",
  create: "/events/categories",
  edit: "/events/categories/edit/:id",
  show: "/events/categories/show/:id",
  meta: {
    canDelete: true,
  },
};

export const eventTypeResource = {
  name: "event-types",
  list: "/events/types",
  create: "/events/types",
  edit: "/events/types/edit/:id",
  show: "/events/types/show/:id",
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
