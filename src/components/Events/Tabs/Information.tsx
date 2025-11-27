import { Box, Heading, Text, DataList, Link } from "@chakra-ui/react";
import TabsLayout from "./TabsLayout";

interface InformationProps {
  event: {
    c_veranst: string;
    c_local: string;
    c_str: string;
  };
  details?: {
    fachgebiet?: string;
    zielgruppe?: string;
    sprachangebot?: string;
    certficate?: string;
    aussteller?: string;
    organisation?: string;
    more_info?: string;
    contact?: string;
    website?: string;
  };
}

export default function Information({ event, details }: InformationProps) {
  return (
    <TabsLayout>
      {/* Veranstalter */}
      <Box>
        <Heading size="md" color="gray.800">
          Veranstalter
        </Heading>
        <Text mt={2} whiteSpace="pre-line">
          {event.c_veranst}
        </Text>
      </Box>

      {/* Veranstaltungsadresse */}
      <Box>
        <Heading size="md" color="gray.800">
          Veranstaltungsadresse
        </Heading>
        <Text mt={2}>{event.c_local}</Text>
        <Text whiteSpace="pre-line">{event.c_str}</Text>
      </Box>

      {/* Details */}
      {details && (
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
      )}
    </TabsLayout>
  );
}
