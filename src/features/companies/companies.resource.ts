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
  list: "/admin/companies/employees",
  create: "/admin/companies/employees/create",
  edit: "/admin/companies/employees/edit/:id",
  show: "/admin/companies/employees/show/:id",
  meta: {
    canDelete: true,
    parentmodule: "companies",
  },
};
