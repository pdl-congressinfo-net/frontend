import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import {
  CanAccess,
  useList,
  useNavigation,
  useOne,
  useParsed,
  useTranslation,
} from "@refinedev/core";
import { useMemo } from "react";
import { DataTable } from "../../../components/Common/DataTable";
import {
  Company,
  CompanyEmployee,
} from "../../../features/companies/companies.model";
import { Contact } from "../../../features/users/users.model";
import { useLayout } from "../../../providers/layout-provider";

type MyParams = {
  companyId: string;
};

const CompanyEmployeesListPage = () => {
  const { translate: t } = useTranslation();
  const { edit } = useNavigation();
  const { setActions, setTitle } = useLayout();
  const {
    resource,
    action,
    id,
    pathname,
    params: { companyId },
  } = useParsed<MyParams>();
  setTitle(t("admin.companies.employees.title", "Company Employees"));
  setActions(null);
  const { result: company } = useOne<Company>({
    resource: "companies",
    id: companyId!,
  });

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
    filters: [{ field: "companyId", operator: "eq", value: companyId }],
    queryOptions: {
      enabled: !!companyId,
    },
  });

  // Memoize global filters to avoid creating a new array each render,
  // which can trigger effects downstream and cause update loops
  const contactGlobalFilters = useMemo(
    () => [
      {
        field: "id",
        operator: "in",
        value: employees?.map((e) => e.contactId) ?? [],
      },
    ],
    [employees],
  );

  if (isEmployeesLoading) return <Box>{t("common.loading")}</Box>;

  return (
    <Box p={4}>
      <Heading mb={4}></Heading>
      <DataTable
        resource="contacts"
        parentModule="users"
        globalFilters={contactGlobalFilters}
        columns={[
          {
            key: "email",
            header: "Email",
            sortable: true,
            searchable: true,
          },
          {
            key: "titles",
            header: "Title",
            sortable: true,
            searchable: true,
            visible: false,
          },
          {
            key: "lastName",
            header: "Last Name",
            sortable: true,
            searchable: true,
            visible: false,
          },
          {
            key: "firstName",
            header: "Name",
            sortable: true,
            searchable: true,
            render: (record: Contact) =>
              `${record.titles ?? ""} ${record.firstName ?? ""} ${record.lastName ?? ""}`.trim(),
          },
          { key: "phoneNumber", header: "Phone" },
          {
            key: "actions",
            header: "Actions",
            render: (record: Contact) => (
              <HStack>
                <CanAccess resource="contacts" action="update">
                  <Button
                    size="sm"
                    onClick={() => {
                      edit("contacts", record.id ?? "");
                    }}
                  >
                    Edit
                  </Button>
                </CanAccess>
              </HStack>
            ),
          },
        ]}
      />
    </Box>
  );
};

export default CompanyEmployeesListPage;
