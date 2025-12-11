export const companyResource = {
  name: "companies",
  list: "/companies",
  create: "/companies/create",
  edit: "/companies/edit/:id",
  show: "/companies/show/:id",
  meta: {
    canDelete: true,
  },
};

export const companyEmployeeResource = {
  name: "companyemployees",
  list: "/companies/employees",
  create: "/companies/employees/create",
  edit: "/companies/employees/edit/:id",
  show: "/companies/employees/show/:id",
  meta: {
    canDelete: true,
    parentmodule: "companies",
  },
};
