export interface CompanyDTO {
  id: string;
  name: string;
  sponsoring: boolean;
  location_id?: string;
}

export interface CompanyEmployeeDTO {
  id: string;
  departement?: string;
  function?: string;
  contact_id?: string;
  company_id?: string;
}

export interface SponsoringDTO {
  id: string;
  name: string;
  value: number;
  employee_id?: string;
  contact_id?: string;
  event_id?: string;
}
