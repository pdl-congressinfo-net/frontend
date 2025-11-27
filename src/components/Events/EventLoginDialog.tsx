import { Button, Dialog, Text } from "@chakra-ui/react";
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
  return (
    <EventDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Anmeldung - ${title}`}
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
          </Dialog.ActionTrigger>
          <Button>Anmelden</Button>
        </>
      }
    >
      <Text>Anmeldeformular für {title}</Text>
    </EventDialog>
  );
};

export default EventLoginDialog;
