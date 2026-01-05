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
  contact_id?: string;
  company_id?: string;
}

export interface UpdateCompanyEmployeeRequest {
  departement?: string;
  function?: string;
  contact_id?: string;
  company_id?: string;
}

export interface CreateSponsoringRequest {
  name: string;
  value?: number;
  employee_id?: string;
  contact_id?: string;
  event_id?: string;
}

export interface UpdateSponsoringRequest {
  name?: string;
  value?: number;
  employee_id?: string;
  contact_id?: string;
  event_id?: string;
}
