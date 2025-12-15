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
  contactId?: string;
  companyId?: string;
}

export interface Sponsoring {
  id: string;
  name: string;
  value: number;
  employeeId?: string;
  contactId?: string;
  eventId?: string;
}
