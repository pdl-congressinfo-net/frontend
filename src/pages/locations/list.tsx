import { Box, Button, IconButton } from "@chakra-ui/react";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { useCallback, useEffect, useState } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { DataTable } from "../../components/Common/DataTable";
import { Location } from "../../features/locations/location.model";
import { useLayout } from "../../providers/layout-provider";

const LocationsCreateActions = () => {
  const { create } = useNavigation();

  return (
    <IconButton
      onClick={() => create("locations")}
      variant="ghost"
      aria-label="Create Location"
      rounded="full"
    >
      <LuCirclePlus />
    </IconButton>
  );
};

const LocationsListPage = () => {
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { show } = useNavigation();

  const onDataChange = useCallback((data: Location[]) => {
    const ids = Array.from(
      new Set(
        data
          .map((location) => location.countryId)
          .filter((id): id is string => id != null),
      ),
    );
    // Only update state if ids actually changed to avoid render loops
    setCountryIds((prev) => {
      if (prev.length === ids.length && prev.every((v, i) => v === ids[i])) {
        return prev;
      }
      return ids;
    });
  }, []);

  const {
    result: { data: countries },
  } = useList({
    resource: "countries",
    meta: { parentModule: "locations" },
    filters:
      countryIds.length > 0
        ? [
            {
              field: "id",
              operator: "in",
              value: countryIds,
            },
          ]
        : [],
  });

  useEffect(() => {
    setTitle(t("admin.locations.title"));
    setActions(<LocationsCreateActions />);
    return () => setActions(null);
  }, [setTitle, setActions, t]);
  return (
    <Box p={4}>
      <DataTable
        resource="locations"
        onDataChange={onDataChange}
        columns={[
          {
            key: "name",
            header: t("admin.locations.table.name"),
            searchable: true,
            sortable: true,
          },
          {
            key: "city",
            header: t("admin.locations.table.city"),
            searchable: true,
            sortable: true,
          },
          {
            key: "countryId",
            header: t("admin.locations.table.country"),
            searchable: true,
            sortable: true,
            render: (record: Location) => {
              const country = countries?.find(
                (country) => country.id === record.countryId,
              );
              return country ? country.name : "";
            },
          },
          {
            key: "actions",
            header: t("admin.locations.table.actions"),
            render: (record: Location) => (
              <Button
                size="sm"
                onClick={() => show("locations", record.id.toString())}
              >
                {t("common.actions.view")}
              </Button>
            ),
          },
        ]}
      />
    </Box>
  );
};

export default LocationsListPage;
