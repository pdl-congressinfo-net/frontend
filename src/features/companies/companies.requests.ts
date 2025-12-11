export interface CreateCompanyRequest {
  name: string;
  sponsoring: boolean;
  location_id?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  sponsoring?: boolean;
  location_id?: string;
}

export interface CreateCompanyEmployeeRequest {
  departement?: string;
  function?: string;
  user_id?: string;
  company_id?: string;
}

export interface UpdateCompanyEmployeeRequest {
  departement?: string;
  function?: string;
  user_id?: string;
  company_id?: string;
}
