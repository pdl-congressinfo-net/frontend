import { Badge, Box, IconButton } from "@chakra-ui/react";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { useEffect, useState } from "react";
import { LuCirclePlus, LuPencil, LuUserSearch } from "react-icons/lu";
import { DataTable } from "../../components/Common/DataTable";
import { Tooltip } from "../../components/ui/tooltip";
import {
  Company,
  CompanyEmployee,
} from "../../features/companies/companies.model";
import { useLayout } from "../../providers/layout-provider";

const CompanyCreateActions = () => {
  const { create } = useNavigation();

  return (
    <IconButton
      onClick={() => create("companies")}
      variant="ghost"
      aria-label="Create Company"
      rounded="full"
    >
      <LuCirclePlus />
    </IconButton>
  );
};

const CompaniesListPage = () => {
  const { translate: t } = useTranslation();
  const { setActions, setTitle } = useLayout();
  const { show, edit } = useNavigation();
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    setTitle(t("admin.companies.title", "Companies"));
    setActions(<CompanyCreateActions />);
  }, [setTitle, setActions]);

  const {
    result: { data: employees },
    query: { isLoading: isEmployeesLoading },
  } = useList<CompanyEmployee>({
    resource: "employees",
    pagination: {
      pageSize: 1000,
    },
    meta: {
      parentModule: "companies",
    },
    filters: companies.length
      ? [
          {
            field: "companyId",
            operator: "in",
            value: companies.map((company) => company.id),
          },
        ]
      : [],
  });

  if (isEmployeesLoading) return <Box>{t("common.loading")}</Box>;

  return (
    <Box p={4}>
      <DataTable
        resource="companies"
        onDataChange={(data) => setCompanies(data)}
        columns={[
          {
            key: "name",
            header: t("admin.companies.table.name"),
            sortable: true,
            searchable: true,
            render: (record: Company) => {
              return (
                <Box display="flex" alignItems="center" gap={2}>
                  {record.name}
                  {record.sponsoring && (
                    <Badge colorPalette="purple" variant="solid" size="xs">
                      {t("admin.companies.table.sponsor", "Sponsor")}
                    </Badge>
                  )}
                </Box>
              );
            },
          },
          {
            key: "employeeCount",
            header: t("admin.companies.table.employeeCount"),
            textAlign: "right",
            width: "12vw",
            render: (record: Company) => {
              const count = employees?.filter(
                (emp) => emp.companyId === record.id,
              ).length;
              return count || "-";
            },
          },
          {
            key: "actions",
            header: t("common.table.actions"),
            textAlign: "right",
            width: "12vw",
            render: (record: Company) => (
              <>
                <Tooltip
                  openDelay={200}
                  closeDelay={0}
                  positioning={{ placement: "right" }}
                  content={t("admin.companies.table.viewContacts")}
                >
                  <IconButton
                    size="sm"
                    onClick={() => show("companyemployees", record.id)}
                    variant="ghost"
                    rounded="full"
                    aria-label="View Contacts"
                  >
                    <LuUserSearch />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  openDelay={200}
                  closeDelay={0}
                  positioning={{ placement: "right" }}
                  content={t("common.view")}
                >
                  <IconButton
                    size="sm"
                    onClick={() => edit("companies", record.id)}
                    variant="ghost"
                    rounded="full"
                    aria-label="Edit Company"
                  >
                    <LuPencil />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ]}
      />
    </Box>
  );
};

export default CompaniesListPage;
