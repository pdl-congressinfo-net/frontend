import { CompanyDTO, CompanyEmployeeDTO } from "./companies.responses";
import { Company, CompanyEmployee } from "./companies.model";

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
    userId: dto.user_id,
    companyId: dto.company_id,
  }),
};
