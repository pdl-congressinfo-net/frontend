import { Button, Dialog, Text } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { EventDialog } from "./EventDialog";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const EventDetailsDialog = ({
  isOpen,
  onClose,
  title,
  children,
}: EventDetailsDialogProps) => {
  const { translate: t } = useTranslation();

  return (
    <EventDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <Dialog.ActionTrigger asChild>
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </Dialog.ActionTrigger>
      }
    >
      {children}
    </EventDialog>
  );
};

export default EventDetailsDialog;
