import { Box, Heading, Text, DataList, Link } from "@chakra-ui/react";
import TabsLayout from "./TabsLayout";
import { useOne } from "@refinedev/core";
import { Country, Location } from "../../../features/locations/location.model";
import { Event } from "../../../features/events/events.model";

interface InformationProps {
  event: Event;
}

export default function Information({ event }: InformationProps) {
  const {
    result: location,
    query: { isLoading, isError },
  } = useOne<Location>({
    resource: "locations",
    id: event.locationId,
    queryOptions: {
      enabled: !!event.locationId,
    },
  });

  const { result: country } = useOne<Country>({
    resource: "countries",
    id: location?.countryId || "",
    queryOptions: {
      enabled: !!location?.countryId,
    },
    meta: {
      parentmodule: "locations",
    },
  });
  return (
    <TabsLayout>
      {/* Veranstalter */}
      <Box>
        <Heading size="md" color="gray.800">
          Veranstalter
        </Heading>
        <Text mt={2} whiteSpace="pre-line">
          {event.startDate?.toLocaleDateString()} -{" "}
          {event.endDate?.toLocaleDateString()}
        </Text>
      </Box>

      {/* Veranstaltungsadresse */}
      {location && (
        <Box>
          <Heading size="md" color="gray.800">
            Veranstaltungsadresse
          </Heading>
          <Text mt={2} fontWeight={"bold"}>
            {location.name}
          </Text>
          {location?.road && (
            <Text>
              {location.road} {location.number}
            </Text>
          )}
          <Text whiteSpace="pre-line">
            {location?.postalCode} {location?.city}
          </Text>
        </Box>
      )}

      {/* Details */}
      {/* {details && (
        <Box>
          <Heading size="md" color="gray.800" mb={3}>
            Details
          </Heading>
          <DataList.Root>
            {details.fachgebiet && (
              <DataList.Item>
                <DataList.ItemLabel>Fachgebiet:</DataList.ItemLabel>
                <DataList.ItemValue>{details.fachgebiet}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.zielgruppe && (
              <DataList.Item>
                <DataList.ItemLabel>Zielpublikum:</DataList.ItemLabel>
                <DataList.ItemValue>{details.zielgruppe}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.sprachangebot && (
              <DataList.Item>
                <DataList.ItemLabel>Sprache(n):</DataList.ItemLabel>
                <DataList.ItemValue>{details.sprachangebot}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.certficate && (
              <DataList.Item>
                <DataList.ItemLabel>Zertifikate:</DataList.ItemLabel>
                <DataList.ItemValue>{details.certficate}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.aussteller && (
              <DataList.Item>
                <DataList.ItemLabel>Aussteller:</DataList.ItemLabel>
                <DataList.ItemValue>{details.aussteller}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.organisation && (
              <DataList.Item>
                <DataList.ItemLabel>Organisation:</DataList.ItemLabel>
                <DataList.ItemValue>{details.organisation}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.more_info && (
              <DataList.Item>
                <DataList.ItemLabel>Weitere Infos:</DataList.ItemLabel>
                <DataList.ItemValue>{details.more_info}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.contact && (
              <DataList.Item>
                <DataList.ItemLabel>Kontakt:</DataList.ItemLabel>
                <DataList.ItemValue>{details.contact}</DataList.ItemValue>
              </DataList.Item>
            )}

            {details.website && (
              <DataList.Item>
                <DataList.ItemLabel>Webseite:</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Link href={`http://${details.website}`} isExternal>
                    {details.website}
                  </Link>
                </DataList.ItemValue>
              </DataList.Item>
            )}
          </DataList.Root>
        </Box>
      )} */}
    </TabsLayout>
  );
}
