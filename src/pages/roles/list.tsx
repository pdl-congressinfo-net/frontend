import {
  Accordion,
  Box,
  Button,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
  Popover,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  CanAccess,
  useCreate,
  useList,
  useNavigation,
  useTranslation,
} from "@refinedev/core";
import { useEffect, useMemo, useState } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { Role } from "../../features/roles/roles.model";
import { User, UserRole } from "../../features/users/users.model";
import { useLayout } from "../../providers/layout-provider";

const RolesListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { list } = useNavigation();
  const { mutateAsync: create } = useCreate();

  const {
    query: { isLoading: isRolesLoading },
    result: { data: rolesData, total: rolesTotal },
  } = useList<Role>({
    resource: "roles",
  });

  const {
    result: { data: usersData, total: usersTotal },
    query: { isLoading: isUsersLoading },
  } = useList<User>({
    resource: "users",
  });

  const {
    result: { data: userRolesData, total: userRolesTotal },
    query: { isLoading: isUserRolesLoading },
  } = useList<UserRole>({
    resource: "roles",
    meta: {
      parentmodule: "users",
    },
  });

  const roles = (rolesData ?? []) as Role[];

  const [roleUserSearch, setRoleUserSearch] = useState("");
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [manuallyOpenedItems, setManuallyOpenedItems] = useState<string[]>([]);

  const [open, setOpen] = useState(false);

  const filteredRoles = useMemo(() => {
    const q = roleUserSearch?.toLowerCase().trim();

    if (!q) return roles;

    return roles.filter((role) => {
      // Check if role name matches
      if (role.name.toLowerCase().includes(q)) return true;

      // Check if any assigned user matches
      const hasMatchingUser = (usersData ?? []).some((user) => {
        const isAssigned = userRolesData?.some(
          (ur) => ur.roleId === role.id && ur.userId === user.id,
        );
        const userMatches =
          user.fullName.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q);
        return isAssigned && userMatches;
      });

      return hasMatchingUser;
    });
  }, [roles, roleUserSearch, usersData, userRolesData]);

  const autoOpenItems = useMemo(() => {
    const q = roleUserSearch?.toLowerCase().trim();

    if (!q) return [];

    // Find roles that have matching users (but don't match the role name itself)
    return filteredRoles
      .filter((role) => {
        // If role name matches, don't auto-open
        if (role.name.toLowerCase().includes(q)) return false;

        // Check if any assigned user matches
        return (usersData ?? []).some((user) => {
          const isAssigned = userRolesData?.some(
            (ur) => ur.roleId === role.id && ur.userId === user.id,
          );
          const userMatches =
            user.fullName.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q);
          return isAssigned && userMatches;
        });
      })
      .map((role) => role.id.toString());
  }, [filteredRoles, roleUserSearch, usersData, userRolesData]);

  // Auto-open accordion items when search changes
  useEffect(() => {
    const q = roleUserSearch?.toLowerCase().trim();

    if (q && autoOpenItems.length > 0) {
      // When searching, merge auto-open items with manually opened items
      setAccordionValue((prev) => {
        const newItems = [
          ...new Set([...manuallyOpenedItems, ...autoOpenItems]),
        ];
        return newItems;
      });
    } else if (!q) {
      // When search is cleared, only keep manually opened items
      setAccordionValue(manuallyOpenedItems);
    }
  }, [autoOpenItems, roleUserSearch, manuallyOpenedItems]);

  const filteredUsers = useMemo(() => {
    const q = roleUserSearch?.toLowerCase().trim();

    if (!q) return usersData ?? [];
    return (usersData ?? []).filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
  }, [usersData, roleUserSearch]);

  useEffect(() => {
    setTitle(t("admin.roles.title"));
  }, [setTitle, setActions, t]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    create({
      resource: "roles",
      values: { name },
    });
    (e.target as HTMLFormElement).reset();
  };

  if (isRolesLoading || isUsersLoading || isUserRolesLoading)
    return <Box>{t("common.loading")}</Box>;

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" align="center" justify="space-between">
        <Heading size="lg">{t("admin.roles.title")}</Heading>
      </Flex>
      <Flex gap={2} align="center">
        <Input
          variant="flushed"
          placeholder={t("admin.roles.searchPlaceholder")}
          value={roleUserSearch}
          onChange={(e) => setRoleUserSearch(e.target.value)}
        />
        <CanAccess resource="roles" action="create">
          <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Popover.Trigger
              as={IconButton}
              aria-label={t("admin.roles.actions.add")}
              onClick={() => setOpen(true)}
              type="button"
            >
              <LuCirclePlus />
            </Popover.Trigger>
            <Popover.Positioner>
              <Popover.Content p={4} bg="white" boxShadow="md">
                <Popover.Arrow />
                <Popover.Body>
                  <form onSubmit={submitHandler}>
                    <Group attached w="full">
                      <Input
                        name="name"
                        placeholder={t("admin.roles.form.roleName")}
                      />

                      <Button type="submit" colorScheme="blue">
                        {t("common.create")}
                      </Button>
                    </Group>
                  </form>
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </CanAccess>
      </Flex>
      <Accordion.Root
        multiple
        value={accordionValue}
        onValueChange={(details) => {
          setAccordionValue(details.value);
          // Track manually opened items (exclude auto-opened items)
          const q = roleUserSearch?.toLowerCase().trim();
          if (!q) {
            // When not searching, all changes are manual
            setManuallyOpenedItems(details.value);
          } else {
            // When searching, filter out auto-opened items to track only manual ones
            const manualItems = details.value.filter(
              (item) => !autoOpenItems.includes(item),
            );
            setManuallyOpenedItems(manualItems);
          }
        }}
      >
        {filteredRoles.map((role) => (
          <Accordion.Item key={role.id} value={role.id.toString()}>
            <Accordion.ItemTrigger
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              p={4}
              borderWidth="1px"
              borderBottomWidth={0}
              _last={{ borderBottomWidth: "1px" }}
            >
              <Flex justify="space-between" align="center" w="full">
                <Text fontWeight="medium">{role.name}</Text>
                <Flex gap={2} align="center">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      list("permissions");
                    }}
                  >
                    {t("admin.roles.actions.viewPermissions")}
                  </Button>
                  <Accordion.ItemIndicator />
                </Flex>
              </Flex>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Stack padding="4" borderWidth="1px" borderTopWidth={0}>
                <Box>
                  <Text fontWeight="bold">
                    {t("admin.roles.assignedUsers")}
                  </Text>
                  {filteredUsers
                    .filter((user) =>
                      userRolesData?.some(
                        (ur) => ur.roleId === role.id && ur.userId === user.id,
                      ),
                    )
                    .map((user) => (
                      <Box key={user.id} ml={4}>
                        <Text>
                          {user.fullName} ({user.email})
                        </Text>
                      </Box>
                    ))}
                  {filteredUsers.every(
                    (user) =>
                      !userRolesData?.some(
                        (ur) => ur.roleId === role.id && ur.userId === user.id,
                      ),
                  ) && (
                    <Text ml={4}>
                      {t("admin.roles.messages.noUsersAssigned")}
                    </Text>
                  )}
                </Box>
              </Stack>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Flex>
  );
};

export default RolesListPage;
