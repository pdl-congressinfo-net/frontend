import { Box, Button, Table } from "@chakra-ui/react";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { Location } from "../../features/locations/location.model";
import { useLayout } from "../../providers/layout-provider";

const LocationsListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { create } = useNavigation();
  const {
    result: data,
    query: { isLoading },
  } = useList<Location>({
    resource: "locations",
  });

  useEffect(() => {
    setTitle(t("admin.locations.title"));
    setActions(
      <Button onClick={() => create("locations")}>
        {t("admin.locations.actions.create")}
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
              {t("admin.locations.table.name")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.locations.table.city")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.locations.table.state")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.locations.table.actions")}
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((location) => (
            <Table.Row key={location.id}>
              <Table.Cell>{location.name}</Table.Cell>
              <Table.Cell>{location.city}</Table.Cell>
              <Table.Cell>{location.state}</Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/locations/show/${location.id}`)
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

export default LocationsListPage;
