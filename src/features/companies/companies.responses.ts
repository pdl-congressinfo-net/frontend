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
  user_id?: string;
  company_id?: string;
}
