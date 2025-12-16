export const companyResource = {
  name: "companies",
  list: "/admin/companies",
  create: "/admin/companies/create",
  edit: "/admin/companies/edit/:id",
  show: "/admin/companies/show/:id",
  meta: {
    canDelete: true,
  },
};

export const companyEmployeeResource = {
  name: "companyemployees",
  show: "/admin/companies/employees/show/:id",
  meta: {
    parentModule: "companies",
  },
};

export const sponsoringsResource = {
  name: "sponsorings",
  list: "/admin/sponsorings",
  create: "/admin/sponsorings/create",
  edit: "/admin/sponsorings/edit/:id",
};
