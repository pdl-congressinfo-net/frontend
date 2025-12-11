export const locationTypeResource = {
  name: "locationtypes",
  list: "/admin/locations/types",
  create: "/admin/locations/types/create",
  edit: "/admin/locations/types/edit/:id",
  show: "/admin/locations/types/show/:id",
  meta: {
    canDelete: true,
    parentmodule: "locations",
  },
};

export const countryResource = {
  name: "countries",
  list: "/admin/locations/countries",
  create: "/admin/locations/countries/create",
  edit: "/admin/locations/countries/edit/:id",
  show: "/admin/locations/countries/show/:id",
  meta: {
    canDelete: true,
    parentmodule: "locations",
  },
};

export const locationResource = {
  name: "locations",
  list: "/admin/locations",
  create: "/admin/locations/create",
  edit: "/admin/locations/edit/:id",
  show: "/admin/locations/show/:id",
  meta: {
    canDelete: true,
  },
};
