export interface Company {
  id: string;
  name: string;
  sponsoring: boolean;
  locationId?: string;
}

export interface CompanyEmployee {
  id: string;
  departement?: string;
  function?: string;
  userId?: string;
  companyId?: string;
}
