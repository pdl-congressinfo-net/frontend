import { Dialog, Portal, Tabs } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { LoginAccount } from "./LoginAccount";
import { RegisterAccount } from "./RegisterAccount";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDialog = ({ isOpen, onClose }: AccountDialogProps) => {
  const { translate: t } = useTranslation();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t("auth.login")}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Tabs.Root defaultValue="login" variant="enclosed" fitted>
                <Tabs.List>
                  <Tabs.Trigger value="login" transition="all 0.2s">
                    {t("auth.login")}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="register" transition="all 0.2s">
                    {t("auth.register")}
                  </Tabs.Trigger>
                </Tabs.List>
                {/* Login Content */}
                <Tabs.Content value="login">
                  <LoginAccount isOpen={isOpen} onClose={onClose} />
                </Tabs.Content>

                {/* Register Content */}
                <Tabs.Content value="register">
                  <RegisterAccount isOpen={isOpen} onClose={onClose} />
                </Tabs.Content>
              </Tabs.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
