import { Button, Dialog, Text } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { EventDialog } from "./EventDialog";

interface EventLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const EventLoginDialog = ({
  isOpen,
  onClose,
  title,
}: EventLoginDialogProps) => {
  const { translate: t } = useTranslation();

  return (
    <EventDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("events.registration.title")}${title}`}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
          </Dialog.ActionTrigger>
          <Button>{t("events.registration.register")}</Button>
        </>
      }
    >
      <Text>
        {t("events.registration.formFor")}
        {title}
      </Text>
    </EventDialog>
  );
};

export default EventLoginDialog;
