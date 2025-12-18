import { Box, IconButton } from "@chakra-ui/react";
import { useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import { LuArchive, LuCirclePlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { DataTable } from "../../components/Common/DataTable";
import { useLayout } from "../../providers/layout-provider";

const EventAdminListActions = () => {
  const navigate = useNavigate();
  const { create } = useNavigation();

  return (
    <>
      <IconButton
        onClick={() => navigate("/events/archive")}
        variant="ghost"
        rounded="full"
        aria-label="Archive Events"
        onMouseDown={(e) => e.preventDefault()}
      >
        <LuArchive />
      </IconButton>
      <IconButton
        onClick={() => create("events")}
        variant="ghost"
        rounded="full"
        aria-label="Add Event"
      >
        <LuCirclePlus />
      </IconButton>
    </>
  );
};

const EventsAdminListPage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Events");
    setActions(<EventAdminListActions />);
  }, [setTitle, setActions]);

  return (
    <Box>
      <DataTable
        resource="events"
        columns={[
          { key: "name", header: "Name", sortable: true, searchable: true },
          {
            key: "startDate",
            header: "Date",
            sortable: true,
            render: (item) => new Date(item.startDate).toLocaleDateString(),
          },
          { key: "location", header: "Location" },
        ]}
      />
    </Box>
  );
};

export default EventsAdminListPage;
