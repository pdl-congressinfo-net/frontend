export const locationTypeResource = {
  name: "locationtypes",
  list: "/locations/types",
  create: "/locations/types/create",
  edit: "/locations/types/edit/:id",
  show: "/locations/types/show/:id",
  meta: {
    canDelete: true,
    parentmodule: "locations",
  },
};

export const countryResource = {
  name: "countries",
  list: "/locations/countries",
  create: "/locations/countries/create",
  edit: "/locations/countries/edit/:id",
  show: "/locations/countries/show/:id",
  meta: {
    canDelete: true,
    parentmodule: "locations",
  },
};

export const locationResource = {
  name: "locations",
  list: "/locations",
  create: "/locations/create",
  edit: "/locations/edit/:id",
  show: "/locations/show/:id",
  meta: {
    canDelete: true,
  },
};
