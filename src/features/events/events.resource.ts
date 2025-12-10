export const eventTypeResource = {
  name: "eventtypes",
  list: "/events/types",
  create: "/events/types",
  edit: "/events/types/edit/:id",
  show: "/events/types/show/:id",
  meta: {
    canDelete: true,
    parent: "events",
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

// Legacy exports for backward compatibility
export const eventCategoryResource = eventTypeResource;
