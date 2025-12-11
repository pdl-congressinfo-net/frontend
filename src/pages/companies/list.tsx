import { Box, Button, Table } from "@chakra-ui/react";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { Company } from "../../features/companies/companies.model";
import { useLayout } from "../../providers/layout-provider";

const CompaniesListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { create } = useNavigation();
  const {
    result: data,
    query: { isLoading },
  } = useList<Company>({
    resource: "companies",
  });

  useEffect(() => {
    setTitle(t("admin.companies.title"));
    setActions(
      <Button onClick={() => create("companies")}>
        {t("admin.companies.actions.create")}
      </Button>,
    );
  }, [setTitle, setActions, create, t]);

  if (isLoading) return <Box>{t("common.loading")}</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              {t("admin.companies.table.name")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.companies.table.sponsoring")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>{t("common.table.actions")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((company) => (
            <Table.Row key={company.id}>
              <Table.Cell>{company.name}</Table.Cell>
              <Table.Cell>
                {company.sponsoring ? t("common.yes") : t("common.no")}
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/companies/show/${company.id}`)
                  }
                >
                  {t("common.actions.view")}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CompaniesListPage;
