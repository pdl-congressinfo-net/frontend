import { Box, Heading, Text, Table } from "@chakra-ui/react";
import TabsLayout from "./TabsLayout";
import { useTranslation } from "react-i18next";
import { Event } from "../../../features/events/events.model";

interface InformationProps {
  event: Event;
}

export default function Information({ event }: InformationProps) {
  const { t } = useTranslation();

  return <Heading>Details werden im internen Bereich angezeigt</Heading>;
  return (
    <TabsLayout>
      <Box>
        <Heading size="md" color="gray.800">
          Details
        </Heading>
        <Text mt={2} whiteSpace="pre-line">
          {event.c_meldeinfo}
        </Text>
      </Box>

      {fees && (
        <Box>
          <Heading size="md" color="gray.800" mb={3}>
            Details
          </Heading>
          <Table.Root size="sm" interactive>
            <Table.Caption>{t("events.fees.caption")}</Table.Caption>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>
                  {t("events.fees.tableRegular")}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t("events.fees.tableEarlyBird")}
                </Table.ColumnHeader>

                <Table.ColumnHeader>
                  {t("events.fees.tableCategory")}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t("events.fees.tableInfo")}
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fees.map((fee) => (
                <Table.Row key={fee.id}>
                  <Table.Cell>{fee.regular}</Table.Cell>
                  <Table.Cell>{fee.earlyBird}</Table.Cell>
                  <Table.Cell>{fee.category}</Table.Cell>
                  <Table.Cell>{fee.info}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </TabsLayout>
  );
}
