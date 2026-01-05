import { Company, CompanyEmployee, Sponsoring } from "./companies.model";
import {
  CompanyDTO,
  CompanyEmployeeDTO,
  SponsoringDTO,
} from "./companies.responses";

export default {
  companies: (dto: CompanyDTO): Company => ({
    id: dto.id,
    name: dto.name,
    sponsoring: dto.sponsoring,
    locationId: dto.location_id,
  }),
  employees: (dto: CompanyEmployeeDTO): CompanyEmployee => ({
    id: dto.id,
    departement: dto.departement,
    function: dto.function,
    contactId: dto.contact_id,
    companyId: dto.company_id,
  }),
  sponsorings: (dto: SponsoringDTO): Sponsoring => ({
    id: dto.id,
    name: dto.name,
    value: dto.value,
    employeeId: dto.employee_id,
    contactId: dto.contact_id,
    eventId: dto.event_id,
  }),
};
