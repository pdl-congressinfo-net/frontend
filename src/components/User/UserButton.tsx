import React from "react";
import { LuCircleUserRound } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { Icon, Button, Menu, Portal } from "@chakra-ui/react";
import { AccountDialog } from "./AccountDialog";
import {
  useLogout,
  useIsAuthenticated,
  useGo,
  useGetIdentity,
} from "@refinedev/core";

interface UserButtonProps {
  className?: string;
  isDialogOpen?: boolean;
  onOpenDialog?: () => void;
  onCloseDialog?: () => void;
}

export const UserButton: React.FC<UserButtonProps> = ({
  isDialogOpen: externalIsDialogOpen,
  onOpenDialog,
  onCloseDialog,
}) => {
  const { mutate: logout } = useLogout();
  const { isLoading, isSuccess } = useIsAuthenticated();
  const { data: user } = useGetIdentity();
  const { t } = useTranslation();
  const [internalIsDialogOpen, setInternalIsDialogOpen] = React.useState(false);
  const go = useGo();

  // Use external state if provided, otherwise use internal state
  const isDialogOpen = externalIsDialogOpen ?? internalIsDialogOpen;
  const handleOpenDialog =
    onOpenDialog ?? (() => setInternalIsDialogOpen(true));
  const handleCloseDialog =
    onCloseDialog ?? (() => setInternalIsDialogOpen(false));

  if (isLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (!user) {
    return (
      <>
        <Button onClick={handleOpenDialog}>{t("common.login")}</Button>
        <AccountDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
      </>
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button>
          <Icon>
            <LuCircleUserRound size={20} />
          </Icon>
          <span>{user.full_name}</span>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="profile" onClick={() => go({ to: "admin" })}>
              {t("user.admin")}
            </Menu.Item>
            <Menu.Item value="settings" onClick={() => go({ to: "settings" })}>
              {t("user.settings")}
            </Menu.Item>
            <Menu.Item
              value="logout"
              onClick={() => logout()}
              color={"fg.error"}
              _hover={{ bg: "bf.error", color: "fg.error" }}
            >
              {t("user.logout")}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
